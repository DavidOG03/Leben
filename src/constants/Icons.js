export const EmptyIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={className} style={style} {...props}>
    <circle cx="18" cy="18" r="17" stroke="#1e1e1e" strokeWidth="1.5" strokeDasharray="5 4" />
    <path d="M11 18h14M18 11v14" stroke="#2a2a2a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CheckIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className} style={style} {...props}>
    <path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);


export const SparkleIcon = ({ className = "", style = {}, color = "currentColor", ...props } = {}) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M7 1.5l1.3 4L12.5 7l-4.2 1.5L7 12.5l-1.3-4L1.5 7l4.2-1.5L7 1.5z"
      stroke={color}
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const SearchIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const BellIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} style={style} {...props}>
    <path d="M9 2a5 5 0 00-5 5v3l-1.5 2h13L14 10V7a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M7 14a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const GearIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" className={className} style={style} {...props}>
    <path fill="currentColor" d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-1.5 0a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0"></path>
    <path fill="currentColor" d="M12 1q.4 0 .797.028c.763.055 1.345.617 1.512 1.304l.352 1.45c.019.078.09.171.225.221q.37.134.728.302c.13.061.246.044.315.002l1.275-.776c.603-.368 1.411-.353 1.99.147q.604.524 1.128 1.129c.501.578.515 1.386.147 1.99l-.776 1.274c-.042.069-.058.185.002.315q.168.357.303.728c.048.135.142.205.22.225l1.45.352c.687.167 1.249.749 1.303 1.512q.057.797 0 1.594c-.054.763-.616 1.345-1.303 1.512l-1.45.352c-.078.019-.171.09-.221.225q-.134.372-.302.728c-.061.13-.044.246-.002.315l.776 1.275c.368.603.353 1.411-.147 1.99q-.524.605-1.129 1.128c-.578.501-1.386.515-1.99.147l-1.274-.776c-.069-.042-.185-.058-.314.002a9 9 0 0 1-.729.303c-.135.048-.205.142-.225.22l-.352 1.45c-.167.687-.749 1.249-1.512 1.303q-.797.057-1.594 0c-.763-.054-1.345-.616-1.512-1.303l-.352-1.45c-.019-.078-.09-.171-.225-.221a8 8 0 0 1-.728-.302c-.13-.061-.246-.044-.315-.002l-1.275.776c-.603.368-1.411.353-1.99-.147q-.605-.524-1.128-1.129c-.501-.578-.515-1.386-.147-1.99l.776-1.274c.042-.069.058-.185-.002-.314a9 9 0 0 1-.303-.729c-.048-.135-.142-.205-.22-.225l-1.45-.352c-.687-.167-1.249-.749-1.304-1.512a11 11 0 0 1 0-1.594c.055-.763.617-1.345 1.304-1.512l1.45-.352c.078-.019.171-.09.221-.225q.134-.372.302-.728c.061-.13.044-.246.002-.315l-.776-1.275c-.368-.603-.353-1.411.147-1.99q.524-.605 1.129-1.128c.578-.501 1.386-.515 1.99-.147l1.274.776c.069.042.185.058.315-.002q.357-.168.728-.303c.135-.048.205-.142.225-.22l.352-1.45c.167-.687.749-1.249 1.512-1.304Q11.598 1 12 1m-.69 1.525c-.055.004-.135.05-.161.161l-.353 1.45a1.83 1.83 0 0 1-1.172 1.277a7 7 0 0 0-.6.249a1.83 1.83 0 0 1-1.734-.074l-1.274-.776c-.098-.06-.186-.036-.228 0a10 10 0 0 0-.976.976c-.036.042-.06.131 0 .228l.776 1.274c.314.529.342 1.18.074 1.734a7 7 0 0 0-.249.6a1.83 1.83 0 0 1-1.278 1.173l-1.45.351c-.11.027-.156.107-.16.162a10 10 0 0 0 0 1.38c.004.055.05.135.161.161l1.45.353a1.83 1.83 0 0 1 1.277 1.172q.111.306.249.6c.268.553.24 1.204-.074 1.733l-.776 1.275c-.06.098-.036.186 0 .228q.453.523.976.976c.042.036.131.06.228 0l1.274-.776a1.83 1.83 0 0 1 1.734-.075q.294.14.6.25a1.83 1.83 0 0 1 1.173 1.278l.351 1.45c.027.11.107.156.162.16a10 10 0 0 0 1.38 0c.055-.004.135-.05.161-.161l.353-1.45a1.83 1.83 0 0 1 1.172-1.278a7 7 0 0 0 .6-.248a1.83 1.83 0 0 1 1.733.074l1.275.776c.098.06.186.036.228 0q.523-.453.976-.976c.036-.042.06-.131 0-.228l-.776-1.275a1.83 1.83 0 0 1-.075-1.733q.14-.294.25-.6a1.83 1.83 0 0 1 1.278-1.173l1.45-.351c.11-.027.156-.107.16-.162a10 10 0 0 0 0-1.38c-.004-.055-.05-.135-.161-.161l-1.45-.353c-.626-.152-1.08-.625-1.278-1.172a7 7 0 0 0-.248-.6a1.83 1.83 0 0 1 .074-1.734l.776-1.274c.06-.098.036-.186 0-.228a10 10 0 0 0-.976-.976c-.042-.036-.131-.06-.228 0l-1.275.776a1.83 1.83 0 0 1-1.733.074a7 7 0 0 0-.6-.249a1.84 1.84 0 0 1-1.173-1.278l-.351-1.45c-.027-.11-.107-.156-.162-.16a10 10 0 0 0-1.38 0"></path>
  </svg>
);

export const PlusIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className} style={style} {...props}>
    <circle cx="14" cy="14" r="13" stroke="#252525" strokeWidth="1.5" strokeDasharray="4 3" />
    <path d="M14 8v12M8 14h12" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const TrashIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M10.5 3.5l-.6 7a.5.5 0 0 1-.5.5H3.6a.5.5 0 0 1-.5-.5l-.6-7" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 6v3M7.5 6v3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const CalendarIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className={className} style={style} {...props}>
    <rect x="0.75" y="1.5" width="9.5" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
    <path d="M0.75 4.5h9.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M3.5 0.75v1.5M7.5 0.75v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const SubtaskIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className={className} style={style} {...props}>
    <path d="M2 2h7M2 5.5h5M2 9h3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const CheckmarkIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" className={className} style={style} {...props}>
    <path d="M1.5 4.5l2 2L8 1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CompletedCheckIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className={className} style={style} {...props}>
    <path d="M1.5 5.5l2.5 2.5L9.5 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AllIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <rect x="0.75" y="0.75" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
    <rect x="7.75" y="0.75" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
    <rect x="0.75" y="7.75" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
    <rect x="7.75" y="7.75" width="4.5" height="4.5" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const ClockIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GridIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const CheckCircleIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style} {...props}>
    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const RepeatIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style} {...props}>
    <path d="M2 5h9a3 3 0 010 6H2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 2L2 5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 8h-9a3 3 0 010-6h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 11l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TrophyIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style} {...props}>
    <path d="M8 11V13M5 15h6M3 2H1v2a4 4 0 003 3.87M13 2h2v2a4 4 0 01-3 3.87M5 2h6v5a3 3 0 01-6 0V2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ChartIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} style={style} {...props}>
    <path d="M2 12l4-4 3 3 5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TaskIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4.5 7.5l2.2 2.2L10.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const HabitIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <path d="M2 5h9a3 3 0 010 6H2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5 2L2 5l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const GoalIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <path d="M7.5 1.5c0 1.8-2.5 3-2.5 5.5a2.5 2.5 0 005 0c0-2.5-2.5-3.7-2.5-5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M3 2.5H1.5V4A3.5 3.5 0 005 7.3M12 2.5h1.5V4A3.5 3.5 0 0110 7.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5.5 13.5h4M7.5 11v2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const AIIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <path d="M7.5 1.5l1.4 4.2L13.5 7l-4.6 1.3L7.5 13.5l-1.4-5.2L1.5 7l4.6-1.3L7.5 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
  </svg>
);

export const AnalyticsIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <path d="M1.5 11.5l3.5-4 2.5 2.5 4-6.5 2 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SettingsIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <circle cx="7.5" cy="7.5" r="2.2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M7.5 1.5v1.8M7.5 11.7v1.8M1.5 7.5h1.8M11.7 7.5h1.8M3.2 3.2l1.3 1.3M10.5 10.5l1.3 1.3M3.2 11.8l1.3-1.3M10.5 4.5l1.3-1.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const HelpIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className} style={style} {...props}>
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5.5 5.5a1.5 1.5 0 013 0c0 .8-.8 1.3-1.5 2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="7" cy="10" r=".65" fill="currentColor" />
  </svg>
);

export const LogoutIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className} style={style} {...props}>
    <path d="M5.5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M9.5 9.5L13 7l-3.5-2.5M13 7H5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LightningIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const RefreshIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export const EditIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const ArrowRightIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    className={className}
    style={style}
    {...props}
  >
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const EyeIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
export const BoltIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <path
      d="M7.5 1L2 7.5h4.5L5 12l6.5-7H7L7.5 1z"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

export const CalIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <rect
      x="1"
      y="2"
      width="11"
      height="9.5"
      rx="1.3"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M1 5h11M4 1v2M9 1v2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);
export const FocusIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <circle cx="6.5" cy="6.5" r="2" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M1 1v3h3M9 1h3v3M1 9v3h3M9 12h3V9"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export const HistoryIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <path
      d="M1.5 6.5A5 5 0 106.5 1.5"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path
      d="M1.5 2v4.5H6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 4v3l2 1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const LockIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

export const NotesIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <rect x="2" y="1.5" width="11" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M4.5 5h6M4.5 7.5h6M4.5 10h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const TrackerIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className={className} style={style} {...props}>
    <path d="M1.5 10.5l3-4 2.5 2 3.5-5.5 3 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M1.5 13.5h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

export const PinIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <path d="M8.5 1.5L11.5 4.5L8 6.5L6.5 11.5L4.5 8L1.5 6.5L6.5 4.5L8.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M1.5 11.5L4.5 8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const NoteDocIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <rect x="1.5" y="1" width="10" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
    <path d="M3.5 4.5h6M3.5 6.5h6M3.5 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const ArchiveIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <rect x="1.5" y="3" width="10" height="8.5" rx="1.2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M1.5 3h10M4.5 6.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M1 3L2.5 1h8L11 3" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
  </svg>
);

export const MoreVerticalIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className={className} style={style} {...props}>
    <circle cx="6.5" cy="2.5" r="1" fill="currentColor" />
    <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
    <circle cx="6.5" cy="10.5" r="1" fill="currentColor" />
  </svg>
);

export const FolderIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <path d="M1 2.5A1.5 1.5 0 012.5 1h3L7 2.5H10.5A1.5 1.5 0 0112 4v6a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 011 10V2.5z" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export const FolderPlusIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <path d="M1 2.5A1.5 1.5 0 012.5 1h3L7 2.5H10.5A1.5 1.5 0 0112 4v6a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 011 10V2.5z" stroke="currentColor" strokeWidth="1.1" />
    <path d="M6 5.5v3M4.5 7H7.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const SmallPlusIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className} style={style} {...props}>
    <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const ViewGridIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <rect x="1" y="1" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1" />
    <rect x="7" y="1" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1" />
    <rect x="1" y="7" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1" />
    <rect x="7" y="7" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.1" />
  </svg>
);

export const ViewListIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <path d="M1 3h10M1 6h10M1 9h10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const EmptyNotesIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className={className} style={style} {...props}>
    <rect x="4" y="3" width="28" height="30" rx="3.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 13h14M11 19h14M11 25h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NoteDocumentIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className={className} style={style} {...props}>
    <rect x="3" y="2" width="22" height="24" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 9h12M8 13h12M8 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CodeIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className={className} style={style} {...props}>
    <path d="M3.5 3L1 5.5 3.5 8M7.5 3L10 5.5 7.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BulletListIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <circle cx="2" cy="3" r="1" fill="currentColor" />
    <circle cx="2" cy="6" r="1" fill="currentColor" />
    <circle cx="2" cy="9" r="1" fill="currentColor" />
    <path d="M5 3h6M5 6h6M5 9h6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const NumberedListIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <path d="M2 2v3M1 3l1-1M1 9a1 1 0 011-1h1a1 1 0 010 2H1v1h2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 3h6M5 6h6M5 9h6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
  </svg>
);

export const ChecklistIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <rect x="1.5" y="1.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
    <path d="M4 6l1.5 1.5L8 4.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const BlockquoteIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <path d="M1.5 4h3v2.5c0 1.2-.8 2-2 2.5M6.5 4h3v2.5c0 1.2-.8 2-2 2.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const MarkdownFileIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={className} style={style} {...props}>
    <rect x="1" y="1" width="8" height="8" rx="1.2" stroke="currentColor" strokeWidth="1" />
    <path d="M2.5 3.5h5M2.5 5h3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const CloseIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={className} style={style} {...props}>
    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const KeyIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

export const ClockCircleIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const AlertTriangleIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const DownloadIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export const ShieldIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const CopyIcon = ({ className = "", style = {}, ...props } = {}) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const SummaryIcon = ({ className = "", style = {}, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className} style={style} {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <g fill="none">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.61 14.38h8.85M6.55 9.44h6.89m-7.06-4.9h4.44M21.2 19.1H10.73c-3.77 0-5.66 0-6.83-1.17s-1.17-3.06-1.17-6.83V2.62" />
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m19.2 22.27l.31-.3c1.34-1.34 2-2 2-2.84s-.66-1.5-2-2.83l-.3-.31" />
      <path fill="currentColor" d="m19.47 4.5l-1.08-2.05l-1.1 2.04l-2.09 1.16l2.1 1.07l1.09 2.39l1.08-2.39l2.27-1.18z" opacity=".2" />
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.44 5.54c1.95 0 4.03-2.1 4.03-4.03m4.03 4.03c-1.93 0-4.03-2.1-4.03-4.03m-4.03 4.03c1.93 0 4.03 2.13 4.03 4.04m4.03-4.04c-1.9 0-4.03 2.1-4.03 4.04" />
    </g>
  </svg>
)

export const ExtractIcon = ({ className = "", style = {}, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" className={className} style={style} {...props}>
    <path d="M0 0h512v512H0z" fill="none" />
    <path fill="currentColor" d="m222.085 235.644l-62.01-62.01L81.8 251.905l62.009 62.01l-.04.04l66.958 66.957l11.354 11.275l.04.039l66.957-66.957l11.273-11.354l202.277-202.271l-78.272-78.271Zm44.33 66.958l-11.274 11.353l-33.057 33.056l-.04-.039l-33.017-33.017l.04-.04l-62.009-62.01l33.016-33.016l62.01 62.009L424.356 78.627l33.017 33.017Z" />
    <path fill="currentColor" d="M448 464H48V64h300.22l32-32H16v464h464V179.095l-32 32z" />
  </svg>
)

export const ImproveIcon = ({ className = "", style = {}, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className={className} style={style} {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.486 22h-1.485v-1.486c0-.471.187-.924.52-1.257l4.867-4.867c.52-.52 1.365-.52 1.885 0l.337.337c.52.52.52 1.365 0 1.886l-4.867 4.866a1.77 1.77 0 0 1-1.257.521M19 10V9c0-3.3 0-4.95-1.025-5.975S15.3 2 12 2h-2C6.7 2 5.05 2 4.027 3.025C3 4.05 3 5.7 3 9v7c0 2.339 0 3.508.537 4.362a3.5 3.5 0 0 0 1.101 1.102C5.492 22 6.662 22 9 22m2-16h4m-8 4h8m-8 4h6" />
  </svg>
)

export const ConnectionIcon = ({ className = "", style = {}, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" className={className} style={style} {...props}>
    <path d="M0 0h512v512H0z" fill="none" />
    <path fill="currentColor" d="M405.333 42.666v32h48l2.171.146c7.1.963 12.72 6.583 13.683 13.683l.146 2.171l-.146 2.171c-.963 7.1-6.583 12.72-13.683 13.683l-2.171.146h-48v42.667h48l2.171.146c7.1.963 12.72 6.583 13.683 13.683l.146 2.171l-.146 2.171c-.963 7.099-6.583 12.719-13.683 13.683l-2.171.146h-48v32h-64l-4.259-.105c-37.866-1.861-69.243-28.404-78.381-63.879l-27.687-.016l-2.804.185a21.33 21.33 0 0 0-12.28 6.063c-7.691 7.69-8.282 19.791-1.775 28.16l1.775 2.01l110.326 110.327l2.891 3.087a64 64 0 0 1 15.855 42.168c0 34.084-26.644 61.944-60.24 63.891l-3.76.109l-27.687.016c-9.138 35.475-40.515 62.018-78.381 63.879l-4.259.105h-64v-32h-48c-8.1 0-14.795-6.02-15.854-13.829l-.146-2.171c0-8.1 6.019-14.795 13.829-15.854l2.17-.146h48.001v-42.667h-48c-8.1 0-14.795-6.019-15.854-13.829l-.146-2.171c0-8.1 6.019-14.794 13.829-15.854l2.17-.146h48.001v-32h64c39.763 0 73.175 27.198 82.646 64.005l27.681-.005l2.487-.143c10.61-1.233 18.846-10.25 18.846-21.19a21.34 21.34 0 0 0-4.396-12.972l-1.852-2.113l-110.327-110.327l-2.88-3.072c-22.074-25.139-21.114-63.444 2.88-87.438a64 64 0 0 1 41.028-18.605l4.226-.14l27.681.005c9.12-35.444 40.441-61.977 78.255-63.894l4.391-.111zM170.667 341.333h-21.334v85.333h21.334l3.184-.117c20.973-1.547 37.73-18.256 39.353-39.208l.129-3.342l-.117-3.184c-1.547-20.973-18.255-37.73-39.207-39.353zm192-256h-21.334l-3.342.129c-19.787 1.533-35.79 16.565-38.811 35.898l-.396 3.455l-.117 3.184l.129 3.342c1.533 19.788 16.565 35.791 35.898 38.812l3.455.396l3.184.117h21.334z" />
  </svg>

)