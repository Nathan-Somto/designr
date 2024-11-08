import { Action } from "./data"
import { CanvasAction } from "../../hooks/useCanvas"

type MenuProps = { currentAction: CanvasAction, isActiveAction: (action: Action | undefined) => boolean, handleAction: (action: Action) => void }