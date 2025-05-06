import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Admin Portal",
  description: "Admin portal with Firebase authentication",
  viewport: "width=device-width, initial-scale=1",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}; 