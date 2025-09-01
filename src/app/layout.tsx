import { Inter } from "next/font/google";
import "./globals.css";
import { type ReactNode } from "react";
import { type Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Schiedam.app - Dé gids voor lokale bedrijven",
	description: "Ontdek alle bedrijven, horeca, winkels, verenigingen en locaties in Schiedam. Shop lokaal en steun ondernemers in je buurt.",
	keywords: "Schiedam, bedrijven, horeca, winkels, directory, lokaal, ondernemers",
	authors: [{ name: "Schiedam.app" }],
	creator: "Schiedam.app",
	openGraph: {
		title: "Schiedam.app",
		description: "Dé complete gids voor alle bedrijven in Schiedam",
		url: "https://schiedam.app",
		siteName: "Schiedam.app",
		locale: "nl_NL",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Schiedam.app",
		description: "Dé complete gids voor alle bedrijven in Schiedam",
	},
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang="nl" className="min-h-screen">
			<body className={`${inter.className} min-h-screen bg-gray-50`}>
				<AuthProvider>
					<CartProvider>
						<div className="flex flex-col min-h-screen">
							<Header />
							<main className="flex-1">
								{children}
							</main>
							<Footer />
						</div>
						<Toaster />
					</CartProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
