import { UserSettings } from "@designr/db/user-settings";
type LayoutKey = keyof UserSettings['layout']
type LayoutValues = UserSettings['layout'][LayoutKey]
const EditorLayoutStyles: Record<LayoutValues, string> = {
    'right': '!fixed top-[120px] z-[60] right-[20px]',
    'bottom-left': 'left-0 z-[50] bottom-[20px] fixed',
    "bottom-right": 'right-0 z-[50] bottom-[20px] fixed',
    'left': '!fixed top-[120px] z-[60] left-[20px]'
}
export {
    EditorLayoutStyles
}