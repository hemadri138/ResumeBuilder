# **App Name**: ResumeForge

## Core Features:

- Resume Form: A vertical form to input resume details, including header information, education, skills, work experience, projects, certifications, and achievements, with basic validation for required fields.
- PDF Generation: Converts the form data into a HTML template, then generates a PDF file using expo-print, optimized for A4 page size and formatted to match the structure of the user's reference resume.
- Preview: Displays a preview of the generated resume based on the current data from the form.
- Download/Share: Allows the user to download the PDF file to their device or share it directly using expo-sharing.
- Dynamic Section Ordering Tool: LLM tool which uses reasoning to dynamically reorder resume sections like education, skills, experience, projects to maximize ATS and human readability.

## Style Guidelines:

- Primary color: Soft blue (#A0D2EB) for a professional and calming feel.
- Background color: Very light grey (#F0F0F0), almost white, for a clean look with good readability.
- Accent color: Darker grey-blue (#70A2B8) for section headers and key elements.
- Body text: 'Inter' sans-serif, for a clean and modern reading experience. Headline text: 'PT Sans', a sans-serif to complement 'Inter'.
- Single-column layout with clear section divisions to mimic the reference resume. Use consistent spacing and padding.
- Minimal use of icons; use simple line icons for contact information like phone, email, and URLs.
- Subtle transitions for form input focus and actions to provide user feedback without distraction.