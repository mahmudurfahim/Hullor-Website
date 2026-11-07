const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
const I = (d, extra) => function Icon({ size = 20, ...rest }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} {...P} {...rest} aria-hidden="true">{d}{extra}</svg>;
};
export const IconBag = I(<><path d="M6 7h12l1 13H5L6 7z" /><path d="M9 7a3 3 0 0 1 6 0" /></>);
export const IconUser = I(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></>);
export const IconHeart = I(<path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21.8l8.8-8.8a5.2 5.2 0 0 0 0-7.4z" />);
export const IconSearch = I(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>);
export const IconMenu = I(<path d="M3 6h18M3 12h18M3 18h18" />);
export const IconClose = I(<path d="M6 6l12 12M18 6 6 18" />);
export const IconTruck = I(<><path d="M1 3h15v13H1zM16 8h4l3 3v5h-7" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></>);
export const IconCash = I(<><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="3" /></>);
export const IconShield = I(<path d="M12 3 4 6v6c0 5 3.4 8.4 8 9 4.6-.6 8-4 8-9V6l-8-3zM9 12l2 2 4-4" />);
export const IconPhone = I(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />);
export const IconCheck = I(<path d="M20 6 9 17l-5-5" />);
export const IconPlus = I(<path d="M12 5v14M5 12h14" />);
export const IconMinus = I(<path d="M5 12h14" />);
export const IconTrash = I(<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" />);
export const IconChevron = I(<path d="m9 6 6 6-6 6" />);
export const IconStar = ({ size = 16, filled = true }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true"><path d="m12 2.5 3 6.2 6.8.9-5 4.7 1.3 6.7-6.1-3.3-6.1 3.3 1.3-6.7-5-4.7 6.8-.9z" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
);
export const IconWhatsapp = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true"><path d="M17.6 6.3A7.9 7.9 0 0 0 12 4a7.9 7.9 0 0 0-6.9 11.9L4 20l4.2-1.1a7.9 7.9 0 0 0 3.8 1A7.9 7.9 0 0 0 17.6 6.3zm-5.6 12.2a6.600 6.600 0 0 1-3.400-.9l-.2-.1-2.500.7.7-2.400-.2-.3a6.600 6.600 0 1 1 5.600 3zm3.600-4.900c-.2-.1-1.200-.6-1.400-.6-.2-.1-.3-.1-.4.1l-.6.8c-.1.1-.2.1-.4 0-.2-.1-.9-.3-1.600-1-.6-.5-1-1.200-1.100-1.400-.1-.2 0-.3.1-.4l.3-.3.2-.3v-.4c-.1-.1-.5-1.100-.6-1.500-.2-.4-.3-.3-.5-.3h-.4c-.1 0-.4.1-.5.3-.2.2-.7.7-.7 1.700s.7 1.900.8 2.100c.1.100 1.400 2.100 3.400 3 .5.2.9.3 1.100.4.5.1.9.1 1.300.1.4-.1 1.200-.5 1.300-.9.2-.5.2-.9.1-.9-.1-.1-.2-.1-.4-.2z" /></svg>
);
export const IconBox = I(<><path d="M21 8 12 3 3 8v8l9 5 9-5V8z" /><path d="m3 8 9 5 9-5M12 13v8" /></>);
export const IconPin = I(<><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.800 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>);
export const IconLogout = I(<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />);
export const IconFilter = I(<path d="M3 5h18l-7 8v6l-4 2v-8L3 5z" />);
