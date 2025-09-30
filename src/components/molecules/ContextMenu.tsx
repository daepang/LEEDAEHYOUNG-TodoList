import React, { useEffect, useRef } from "react";
import { colors } from "@/constants/color";

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

  return (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: y,
        left: x,
        background: colors.white,
        border: `1px solid ${colors.gray400}`,
        borderRadius: 6,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
        minWidth: 160,
        padding: "4px 0",
      }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            if (!item.disabled) {
              item.onClick();
              onClose();
            }
          }}
          style={{
            padding: "8px 16px",
            cursor: item.disabled ? "not-allowed" : "pointer",
            opacity: item.disabled ? 0.5 : 1,
            fontSize: 14,
            userSelect: "none",
            background: colors.white,
          }}
          onMouseEnter={(e) => {
            if (!item.disabled) {
              e.currentTarget.style.background = colors.bgHover;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = colors.white;
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
}
