const FontFamily = {
  HelveticaNeueM: 'HelveticaNeue-Medium',
  Helvetica65R: 'HelveticaNeue',
} as const;

export const BaseThemeStyle = {
  //add color code here
  colors: {
    primary: '#370f4d',
    secondary: '#c28bcc',
    background: '#101d25',
    danger: '#E36363',
    warning: '#F2994A',
    success: '#4ACA9B',
    error: '#FF0C3E',
    black: '#000000',
    gray: '#9E9E9E',
    lightGray: '#E5E7EC',
    white: '#FFFFFF',
    blue: '#4389BC',
    transparent: 'transparent',
    titleColor: '#071B45',
    olive: '#808000',
    iconColor: '#4389BC',
    tabBackGroundColor: '#2D9CDB',
    screenBackgroundColor: '#F2F3F5',
    listItemBackgroundColor: '#E5E7EC',
    textColor: '#6A768F',
    selectedListColor: '#D3D3D3',
    lightGrayOnModal: '#00000099',
    placeholder: '#9BA3B4',
    addIconColor: '#979797',
  },
  paddings: {
    bodyHorizontal: 0,
    bodyVertical: 0,
    containers: 8,
    formElements: 16,
    listElement: 20,
    bottomContainer: 24,
  },
  margin: {
    containers: 8,
    formElements: 16,
    topContainer: 24,
    screenContainer: 20,
    subtitle: 10,
  },
  dimensions: {
    widths: {
      breadCrumbBorder: 25,
      breadCrumbSquare: 70,
    },
    heights: {
      buttons: 44,
      topBars: 56,
      bottomContainer: 60,
      breadCrumbSquare: 35,
    },
    borderWidths: {
      buttons: 1,
      formFields: 1.2,
      radio: 2,
      listsItems: 1,
    },
    borderRadiuses: {
      containers: 8,
      buttons: 22,
      formFields: 4,
      customItemsList: 4,
    },
  },
  decorations: {
    opacity: {
      disabledButtons: 0.5,
    },
  },

  fonts: {
    pageTitle: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 30,
    },
    pageSubTitle: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 20,
    },
    listTitle: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 17,
    },
    h1: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 96,
    },
    h2: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 60,
    },
    h3: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 42,
    },
    h4: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 22,
    },
    h5: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 30,
    },
    h6: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 21,
    },
    h7: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 20,
    },
    h8: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 18,
    },
    body1: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 16,
    },
    body2: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 15,
    },
    subtitle0: {
      fontFamily: FontFamily.Helvetica65R,
      fontSize: 16,
    },
    subtitle1: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 15,
    },
    subtitle2: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 15,
    },
    button: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 13,
    },
    subtitle3: {
      fontFamily: FontFamily.HelveticaNeueM,
      fontSize: 12,
    },
  },
};
