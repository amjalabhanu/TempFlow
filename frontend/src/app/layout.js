import "../styles/globals.css";
import { DemoAuthProvider } from "@/context/DemoAuthContext";
import { DemoWorkspaceProvider } from "@/context/DemoWorkspaceContext";

export const metadata = {
  title: "FlowSpace",
  description: "Collaborative diagramming platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DemoAuthProvider>
          <DemoWorkspaceProvider>{children}</DemoWorkspaceProvider>
        </DemoAuthProvider>
      </body>
    </html>
  );
}
