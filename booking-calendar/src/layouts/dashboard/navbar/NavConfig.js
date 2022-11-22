// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
};

const navConfig = [
  {
    subheader: 'management',
    items: [
      // USER
      {
        title: 'user',
        path: '/user',
        icon: ICONS.user,
        role: [1],
        children: [
          { title: 'User List', path: '/user/list' },
          { title: 'User Add', path: '/user/add' },
        ],
      },

      // appointment
      {
        title: 'appointment',
        path: '/appointment',
        icon: ICONS.cart,
        role: [2, 3],
        children: [{ title: 'Appointment List', path: '/appointment/list' }],
      },
    ],
  },
];

export default navConfig;
