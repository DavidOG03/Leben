import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import webpush from "web-push";

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Initialize Web Push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:support@leben.app";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

// Initialize Supabase Service Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(req: Request) {
  // Optional: verify a cron secret to prevent unauthorized access
  // const authHeader = req.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new Response('Unauthorized', { status: 401 });
  // }

  if (!supabaseServiceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 500 },
    );
  }

  try {
    // We want to trigger reminders that are due within the next 10 minutes
    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);

    // 1. Fetch Tasks
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("*, auth_users:user_id(email)")
      .lte("reminder_at", tenMinutesFromNow.toISOString())
      .or("email_sent.eq.false,push_sent.eq.false")
      .eq("status", "pending");

    if (tasksError) {
      console.error("Error fetching tasks:", tasksError);
      throw tasksError;
    }

    // Process Tasks
    for (const task of tasks || []) {
      const userEmail = task.auth_users?.email;
      const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("*")
        .eq("user_id", task.user_id);

      // --- EMAIL ---
      if (!task.email_sent && userEmail && process.env.RESEND_API_KEY) {
        try {
          await resend.emails.send({
            from: "Leben Reminders <reminders@leben.app>", // Update with your verified domain!
            to: [userEmail],
            subject: `Reminder: ${task.title}`,
            html: `
              <div style="font-family: sans-serif; padding: 20px;">
                <h2>⏰ Reminder</h2>
                <p>Your task <strong>${task.title}</strong> is due soon.</p>
                ${task.description ? `<p>${task.description}</p>` : ""}
                <br />
                <a href="https://leben-os.vercel.app" style="background: #7c6af0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View in Leben</a>
              </div>
            `,
          });
          await supabase
            .from("tasks")
            .update({ email_sent: true })
            .eq("id", task.id);
        } catch (emailErr) {
          console.error("Email send error for task", task.id, emailErr);
        }
      }

      // --- PUSH NOTIFICATION ---
      if (
        !task.push_sent &&
        subscriptions &&
        subscriptions.length > 0 &&
        vapidPublicKey
      ) {
        let pushSuccess = false;
        for (const sub of subscriptions) {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };
          const payload = JSON.stringify({
            title: "Task Reminder",
            body: `Your task "${task.title}" is due soon.`,
          });
          try {
            await webpush.sendNotification(pushSubscription, payload);
            pushSuccess = true;
          } catch (pushErr: any) {
            console.error("Push send error for task", task.id, pushErr);
            // If subscription is invalid/expired (status 410 or 404), we could delete it
            if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
              await supabase
                .from("push_subscriptions")
                .delete()
                .eq("id", sub.id);
            }
          }
        }
        if (pushSuccess) {
          await supabase
            .from("tasks")
            .update({ push_sent: true })
            .eq("id", task.id);
        }
      }
    }

    return NextResponse.json({ success: true, processedTasks: tasks?.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
