import { headerContainerStyle, headerTitleStyle, headerSubtitleStyle } from "./style";

export function Header() {
    return (
        <header style={headerContainerStyle}>
            <div>
                <h1 style={headerTitleStyle}>📝 Todo List</h1>
                <p style={headerSubtitleStyle}>마크다운 기반 할 일 관리</p>
            </div>
        </header>
    );
}
