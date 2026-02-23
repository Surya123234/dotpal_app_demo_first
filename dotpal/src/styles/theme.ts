/**
 * Theme and Style Constants
 * Centralized styling for consistent appearance across components
 */

// Color Schemes for each learning mode
export const colorSchemes = {
  letter: {
    primary: "#667eea",
    secondary: "#764ba2",
    shadow: "rgba(102, 126, 234, 0.2)",
    buttonShadow: "rgba(102, 126, 234, 0.3)",
    buttonShadowHover: "rgba(102, 126, 234, 0.4)",
  },
  word: {
    primary: "#f5576c",
    secondary: "#f093fb",
    shadow: "rgba(245, 87, 108, 0.2)",
    buttonShadow: "rgba(245, 87, 108, 0.3)",
    buttonShadowHover: "rgba(245, 87, 108, 0.4)",
  },
  dot: {
    primary: "#4facfe",
    secondary: "#00f2fe",
    shadow: "rgba(79, 172, 254, 0.2)",
    buttonShadow: "rgba(79, 172, 254, 0.3)",
    buttonShadowHover: "rgba(79, 172, 254, 0.4)",
  },
};

// Reusable Box Styles
export const boxStyles = {
  card: {
    display: "flex" as const,
    flexDirection: "column" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: "2rem",
    padding: "2rem",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px" as const,
  },
  cardSmall: {
    padding: "2rem 1.5rem",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
    minWidth: "200px",
    textAlign: "center" as const,
  },
  statusIndicator: (isConnected: boolean, isError = false) => ({
    padding: "1rem",
    background: isConnected
      ? "rgba(76, 175, 80, 0.2)"
      : isError
        ? "rgba(255, 107, 107, 0.2)"
        : "rgba(100, 100, 100, 0.2)",
    borderRadius: "8px",
    color: "white",
    textAlign: "center" as const,
    marginBottom: "1rem",
    border: isConnected
      ? "1px solid rgba(76, 175, 80, 0.5)"
      : isError
        ? "1px solid rgba(255, 107, 107, 0.5)"
        : "1px solid rgba(100, 100, 100, 0.5)",
  }),
};

// Button Styles
export const buttonStyles = {
  primary: (color: string = "#667eea") => ({
    padding: "0.75rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "bold" as const,
    background: `linear-gradient(135deg, ${color} 0%, rgba(0,0,0,0.1) 100%)`,
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer" as const,
    boxShadow: `0 4px 12px ${color}50`,
    transition: "transform 0.2s, box-shadow 0.2s",
  }),
  secondary: {
    padding: "0.6rem 1.2rem",
    fontSize: "0.85rem",
    fontWeight: "bold" as const,
    background: "rgba(102, 126, 234, 0.1)",
    color: "#667eea",
    border: "1.5px solid #667eea",
    borderRadius: "8px",
    cursor: "pointer" as const,
    transition: "all 0.2s",
  },
};

// Hover Effects for buttons
export const buttonHoverEffects = {
  lift: (shadowColor: string = "rgba(102, 126, 234, 0.4)") => ({
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      target.style.transform = "translateY(-2px)";
      target.style.boxShadow = `0 6px 16px ${shadowColor}`;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      const target = e.currentTarget;
      target.style.transform = "translateY(0)";
      const originalShadow = target.getAttribute("data-shadow");
      if (originalShadow) {
        target.style.boxShadow = originalShadow;
      }
    },
  }),
};

// Typography Styles
export const typography = {
  heading1: {
    fontSize: "1.8rem",
    color: "#333",
    margin: 0,
    fontWeight: "bold" as const,
  },
  heading2: {
    fontSize: "1.5rem",
    color: "#333",
    margin: 0,
    fontWeight: "bold" as const,
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#666",
    margin: "0 0 0.5rem 0",
  },
  label: {
    fontSize: "1.1rem",
    color: "#666",
    margin: 0,
  },
};

// Spacing Constants
export const spacing = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
};

// Border Radius Constants
export const borderRadius = {
  small: "8px",
  medium: "15px",
  large: "20px",
  full: "50%",
};

// Shadow Constants
export const shadows = {
  small: "0 2px 4px rgba(0, 0, 0, 0.1)",
  medium: "0 4px 12px rgba(0, 0, 0, 0.1)",
  large: "0 8px 32px rgba(0, 0, 0, 0.1)",
};
