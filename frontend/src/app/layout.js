import "../styles/globals.css";

export const metadata = {
  title: "FlowSpace",
  description: "Collaborative diagramming platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}