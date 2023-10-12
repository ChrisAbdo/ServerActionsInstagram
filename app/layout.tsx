import { AuthProvider } from "@/lib/auth-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import MainNav from "@/components/layout/main-nav";
import { Toaster } from "@/components/ui/toaster";
import { Container } from "@/components/layout/container";
import { ThemeProvider } from "@/lib/theme-provider";
import Footer from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

const title = "Ignite: Find awesome open source projects";
const description =
  "Ignite is a community-driven platform for discovering and sharing open source projects.";

export const metadata = {
  title: title,
  description: description,
  twitter: {
    card: "summary_large_image",
    title: title,
    description: description,
    creator: "@abdo_eth",
  },
  metadataBase: new URL("https://infinix.chrisabdo.dev"),
  themeColor: "#FFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <AuthProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <MainNav />
            <Container>
              <div className="min-h-screen">{children}</div>
            </Container>
            <Footer />
          </ThemeProvider>

          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
