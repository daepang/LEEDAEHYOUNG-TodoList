import { footerStyle, titleStyle, infoContainerStyle } from "./style";

export function Footer() {
  return (
    <footer style={footerStyle}>
      <div>
        <strong>LEEDAEHYOUNG TodoList</strong>
        <span style={titleStyle}>v1.0.0</span>
      </div>
      <div style={infoContainerStyle}>
        <span>💾 로컬 마크다운 기반</span>
      </div>
    </footer>
  );
}
