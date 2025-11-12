import { useEffect, useRef, useState } from "react";
import { getMenuStyle, getMenuItemStyle, menuItemHoverStyle } from "./style";

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: Array<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
  }>;
}

export function ContextMenu({ x, y, onClose, items }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleItemClick = (item: (typeof items)[number]) => {
    if (!item.disabled) {
      item.onClick();
      onClose();
    }
  };

  const handleMouseEnter = (index: number, disabled?: boolean) => {
    if (!disabled) {
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <div ref={menuRef} style={getMenuStyle(x, y)} role="menu">
      {items.map((item, index) => (
        <div
          key={index}
          role="menuitem"
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => handleMouseEnter(index, item.disabled)}
          onMouseLeave={handleMouseLeave}
          style={{
            ...getMenuItemStyle(item.disabled),
            ...(hoveredIndex === index ? menuItemHoverStyle : {}),
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
