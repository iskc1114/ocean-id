import './globals.css';

export const metadata = {
title: 'Ocean ID',
description: 'AI Marine Identification',
};
export default function RootLayout({ children }) {
return (
<html lang="en">
<body>{children}</body>
</html>
);
}
