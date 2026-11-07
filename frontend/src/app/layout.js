import "../styles/globals.css";
import ClientProviders from "@/components/layout/ClientProviders";

export const metadata = {
  title: "FlowSpace",
  description: "Collaborative diagramming platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
