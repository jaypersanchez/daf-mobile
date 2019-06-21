import { createTheme } from '@kancha/kancha-ui'
import Colors from './colors'

/**
 *  A theme section can be merged with the default theme to create variations.
 *  If you use colors in your section you can pass in your custom color object
 *  const themeSection = (colors) => {
 *    return {
 *      roundedCorners: {
 *        buttons: 5,
 *      },
 *      someCustomElement: {
 *        borderColor: colors.MY_CUSTOM_COLOR
 *      }
 *    }
 *  }
 *  export default mergeTheme(themeSection, CUSTOM_COLORS)
 */
export default createTheme(Colors)
