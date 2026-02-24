/**
 * Theme and Style Constants
 * Black and White Contrasting Theme for Full Desktop Utilization
 */

// Black and White Color Scheme
export const colorSchemes = {
  letter: {
    primary: "#000000",
    secondary: "#1a1a1a",
    shadow: "rgba(0, 0, 0, 0.3)",
    buttonShadow: "rgba(0, 0, 0, 0.5)",
    buttonShadowHover: "rgba(0, 0, 0, 0.7)",
  },
  word: {
    primary: "#000000",
    secondary: "#1a1a1a",
    shadow: "rgba(0, 0, 0, 0.3)",
    buttonShadow: "rgba(0, 0, 0, 0.5)",
    buttonShadowHover: "rgba(0, 0, 0, 0.7)",
  },
  dot: {
    primary: "#000000",
    secondary: "#1a1a1a",
    shadow: "rgba(0, 0, 0, 0.3)",
    buttonShadow: "rgba(0, 0, 0, 0.5)",
    buttonShadowHover: "rgba(0, 0, 0, 0.7)",
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
    padding: "clamp(1.5rem, 2.5vw, 2.5rem)",
    background: "#ffffff",
    borderRadius: "0px",
    boxShadow: "0 0 0 2px #000000",
    maxWidth: "100%" as const,
    width: "100%" as const,
    maxHeight: "90vh" as const,
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
  },
  cardSmall: {
    padding: "2rem 2rem",
    background: "#ffffff",
    borderRadius: "0px",
    boxShadow: "0 0 0 2px #000000",
    minWidth: "280px",
    textAlign: "center" as const,
  },
  statusIndicator: (isConnected: boolean, isError = false) => ({
    padding: "1rem 1.5rem",
    background: isConnected ? "#000000" : isError ? "#000000" : "#1a1a1a",
    borderRadius: "0px",
    color: "white",
    textAlign: "center" as const,
    marginBottom: "1rem",
    border: "2px solid #ffffff",
    fontWeight: "bold" as const,
  }),
};

// Button Styles
export const buttonStyles = {
  primary: (color: string = "#000000") => ({
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    fontWeight: "bold" as const,
    background: "#000000",
    color: "#ffffff",
    border: "3px solid #000000",
    borderRadius: "0px",
    cursor: "pointer" as const,
    boxShadow: "4px 4px 0px rgba(0,0,0,0.3)",
    transition: "all 0.2s",
  }),
  secondary: {
    padding: "0.8rem 1.5rem",
    fontSize: "0.95rem",
    fontWeight: "bold" as const,
    background: "#ffffff",
    color: "#000000",
    border: "3px solid #000000",
    borderRadius: "0px",
    cursor: "pointer" as const,
    transition: "all 0.2s",
    boxShadow: "3px 3px 0px rgba(0,0,0,0.2)",
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
    fontSize: "2.5rem",
    color: "#000000",
    margin: 0,
    fontWeight: "bold" as const,
  },
  heading2: {
    fontSize: "1.8rem",
    color: "#000000",
    margin: 0,
    fontWeight: "bold" as const,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#000000",
    margin: "0 0 0.5rem 0",
    fontWeight: "600" as const,
  },
  label: {
    fontSize: "1.2rem",
    color: "#000000",
    margin: 0,
    fontWeight: "600" as const,
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
