"use client";

import { useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Download,
  Github,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getOptimalSectionOrder } from "./actions";

// Zod Schemas for validation
const headerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  role: z.string().min(1, "Role/Title is required"),
  location: z.string(),
  phone: z.string(),
  email: z.string().email("Invalid email address"),
  linkedin: z.string().url().optional().or(z.literal("")),
  github: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
});

const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  university: z.string().min(1, "University is required"),
  specialization: z.string(),
  institute: z.string(),
  year: z.string(),
  gpa: z.string(),
});

const skillCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  keywords: z.string(),
});

const skillsSchema = z.array(skillCategorySchema);

const experienceSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company is required"),
  duration: z.string(),
  responsibilities: z.string(),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string(),
  techStack: z.string(),
});

const certificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string(),
});

const achievementsSchema = z.object({
  points: z.string(),
});

const resumeSchema = z.object({
  header: headerSchema,
  education: z.array(educationSchema),
  skills: skillsSchema,
  experience: z.array(experienceSchema),
  projects: z.array(projectSchema),
  certifications: z.array(certificationSchema),
  achievements: achievementsSchema,
});

type ResumeData = z.infer<typeof resumeSchema>;

const defaultValues: ResumeData = {
  header: {
    name: 'Hemadri Kurukuti',
    role: 'Full Stack Developer',
    location: 'Bengaluru, India',
    phone: '+91-6302539492',
    email: 'hemadri1316@gmail.com',
    linkedin: 'http://www.linkedin.com/in/hemadri-kurukuti',
    github: 'https://github.com/hemadri138',
    portfolio: 'https://hemadri-kurukuti-portfolioweb.netlify.app/',
  },
  education: [
    {
      degree: 'Post Graduation',
      university: 'NITK Surathkal',
      specialization: 'Marine Structures',
      institute: 'NITK Surathkal',
      year: '2022',
      gpa: '8.31',
    },
    {
      degree: 'Graduation',
      university: 'JNTUA, Anantapur',
      specialization: 'Civil Engineering',
      institute: 'JNTUA, Pulivendula',
      year: '2020',
      gpa: '8.82',
    },
  ],
  skills: [
    { name: 'Front-End', keywords: 'AngularJS, ReactJs, NextJs, Vite, Expo, React Native, JavaScript (ES6+), TypeScript, HTML5, CSS3' },
    { name: 'Back-End', keywords: 'Node.js, C# .NET, RESTful APIs, PostgreSQL, Express.js, NPM, Python' },
    { name: 'Cloud & DevOps', keywords: 'AWS (Amplify, Cognito, EC2), Azure DevOps, CI/CD Pipelines, Git' },
    { name: 'Databases', keywords: 'PostgreSQL, MySQL, MongoDB' },
    { name: 'Testing', keywords: 'Postman, Swagger, Unit & Integration Testing' },
  ],
  experience: [
    {
      title: 'Senior Associate',
      company: 'PwC India',
      duration: 'Apr 2025 - Present',
      responsibilities:
        '- Developed and deployed secure, scalable enterprise mobility solutions using React, React Native, C# .NET, and AWS, reducing internal sales/service response time by 40%, with direct accountability for technical direction, architectural decisions, and stakeholder alignment.\n- Led client interactions as the front-end lead, gathering business requirements and delivering tailored technical solutions using JavaScript, RESTful APIs, and cross-browser web technologies, improving system efficiency by 25%.',
    },
    {
      title: 'Associate',
      company: 'PwC India',
      duration: 'July 2022 - March 2025',
      responsibilities:
        '- Migrated 20+ Node.js microservices to latest architecture using QuickSuite, integrated SonarQube for static code writing test cases for each service with minimum 80% code coverage.\n- Built a multi-channel e-commerce platform (D2C, B2B, B2C) with React, React Native, and Redux, implementing secure payment gateways (PayU), and leveraging Azure DevOps for CI/CD pipeline and cloud deployment.\n- Delivered 3+ enterprise web and mobile applications, reducing deployment time by 30% and resulting client satisfaction through improved UI/UX with enhanced system efficiency and security compliance reviews, ensuring alignment with OWASP practices and enterprise-grade protocols (HTTP, TCP/IP).',
    },
  ],
  projects: [
    {
      name: 'Habit & Expense Tracker App',
      description: 'Built and published the apps on the Google Play Store.\nDesigned and developed cross-platform mobile apps (Expo, React Native) with offline storage using AsyncStorage.',
      techStack: 'Expo, React Native, AsyncStorage',
    },
  ],
  certifications: [
    { name: 'PL900 - Power Platform Fundamentals', issuer: '' },
    { name: 'AZ900 - Azure Fundamentals', issuer: '' },
    { name: 'AZ204 - Azure Developer Associate', issuer: '' },
    { name: 'AZ104 - Azure Administrator Associate', issuer: '' },
    { name: 'AI102 - Azure Data Engineer Associate', issuer: '' },
  ],
  achievements: {
    points:
      '- Awarded NMMS Scholarship by DSEL, GoI (Top 1% in state) | 2013\n- Achieved AIR 8847 in GATE (Civil Engineering) | 2020\n- Deployed apps on Google Play Store, managing testing and releases and contributed to peer code reviews and best practices, ensuring clean, scalable, and maintainable code.\n- Explored and utilised AI agents and automation workflows, with real-world use cases for productivity.',
  },
};

const DYNAMIC_SECTIONS: (keyof Omit<ResumeData, "header" | "achievements" | "certifications">)[] = ['education', 'skills', 'experience', 'projects'];
const STATIC_SECTIONS: (keyof Omit<ResumeData, "header" | "education" | "skills" | "experience" | "projects">)[] = ['certifications', 'achievements'];

export default function ResumeForgePage() {
  const [orderedSections, setOrderedSections] = useState<(keyof ResumeData)[]>([...DYNAMIC_SECTIONS, ...STATIC_SECTIONS]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({ control: form.control, name: "education" });
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({ control: form.control, name: "experience" });
  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({ control: form.control, name: "projects" });
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({ control: form.control, name: "certifications" });
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({ control: form.control, name: "skills" });


  const watchedData = form.watch();

  const handlePrint = () => {
    window.print();
  };

  const handleOptimizeOrder = async () => {
    setIsOptimizing(true);
    const formData = form.getValues();
    const input = {
        education: JSON.stringify(formData.education),
        skills: formData.skills.map(s => `${s.name}: ${s.keywords}`).join('\n'),
        experience: JSON.stringify(formData.experience),
        projects: JSON.stringify(formData.projects),
    };
    
    try {
        const result = await getOptimalSectionOrder(input);

        if (result && 'orderedSections' in result) {
            const newDynamicOrder = result.orderedSections
              .map(s => s.toLowerCase())
              .filter(s => DYNAMIC_SECTIONS.includes(s as any)) as (keyof ResumeData)[];
            
            const reordered = [...new Set([...newDynamicOrder, ...DYNAMIC_SECTIONS])];

            setOrderedSections([...reordered, ...STATIC_SECTIONS]);

            toast({
                title: "✨ Sections Reordered by AI",
                description: <p className="text-sm">{result.reasoning}</p>,
                duration: 10000,
            });
        } else {
            throw new Error(result.error || 'Unknown error occurred');
        }
    } catch (e: any) {
        toast({
            variant: "destructive",
            title: "Optimization Failed",
            description: e.message || "Could not reorder sections.",
        });
    } finally {
        setIsOptimizing(false);
    }
  };
  
  const sectionFormMap: Record<keyof Omit<ResumeData, "header">, React.ReactNode> = {
    education: (
      <AccordionItem value="education" key="education">
        <AccordionTrigger className="font-headline text-lg">Education</AccordionTrigger>
        <AccordionContent className="space-y-4">
          {educationFields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Entry {index + 1}</CardTitle>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeEducation(index)}><Trash2 size={16} /></Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`education.${index}.degree`} render={({ field }) => <FormItem><FormLabel>Degree</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name={`education.${index}.university`} render={({ field }) => <FormItem><FormLabel>University</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name={`education.${index}.specialization`} render={({ field }) => <FormItem><FormLabel>Specialization</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                <FormField control={form.control} name={`education.${index}.institute`} render={({ field }) => <FormItem><FormLabel>Institute</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                <FormField control={form.control} name={`education.${index}.year`} render={({ field }) => <FormItem><FormLabel>Year</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                <FormField control={form.control} name={`education.${index}.gpa`} render={({ field }) => <FormItem><FormLabel>GPA/CPI</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={() => appendEducation({ degree: "", university: "", specialization: "", institute: "", year: "", gpa: "" })}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    skills: (
      <AccordionItem value="skills" key="skills">
        <AccordionTrigger className="font-headline text-lg">Skills</AccordionTrigger>
        <AccordionContent className="space-y-4">
          {skillFields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Category {index + 1}</CardTitle>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeSkill(index)}><Trash2 size={16} /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`skills.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., Programming Languages" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`skills.${index}.keywords`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Comma-separated skills" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={() => appendSkill({ name: "", keywords: "" })}><Plus className="mr-2 h-4 w-4" /> Add Skill Category</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    experience: (
      <AccordionItem value="experience" key="experience">
        <AccordionTrigger className="font-headline text-lg">Work Experience</AccordionTrigger>
        <AccordionContent className="space-y-4">
          {experienceFields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Role {index + 1}</CardTitle>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeExperience(index)}><Trash2 size={16} /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name={`experience.${index}.title`} render={({ field }) => <FormItem><FormLabel>Job Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name={`experience.${index}.company`} render={({ field }) => <FormItem><FormLabel>Company</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name={`experience.${index}.duration`} render={({ field }) => <FormItem><FormLabel>Duration</FormLabel><FormControl><Input {...field} placeholder="e.g., Jan 2022 - Present"/></FormControl></FormItem>} />
                <FormField control={form.control} name={`experience.${index}.responsibilities`} render={({ field }) => <FormItem><FormLabel>Responsibilities</FormLabel><FormControl><Textarea {...field} placeholder="Use bullet points, one per line" /></FormControl></FormItem>} />
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={() => appendExperience({ title: "", company: "", duration: "", responsibilities: "" })}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    projects: (
       <AccordionItem value="projects" key="projects">
        <AccordionTrigger className="font-headline text-lg">Projects</AccordionTrigger>
        <AccordionContent className="space-y-4">
          {projectFields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Project {index + 1}</CardTitle>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeProject(index)}><Trash2 size={16} /></Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField control={form.control} name={`projects.${index}.name`} render={({ field }) => <FormItem><FormLabel>Project Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name={`projects.${index}.description`} render={({ field }) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl></FormItem>} />
                <FormField control={form.control} name={`projects.${index}.techStack`} render={({ field }) => <FormItem><FormLabel>Tech Stack</FormLabel><FormControl><Input {...field} placeholder="Comma-separated" /></FormControl></FormItem>} />
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={() => appendProject({ name: "", description: "", techStack: "" })}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    certifications: (
       <AccordionItem value="certifications" key="certifications">
        <AccordionTrigger className="font-headline text-lg">Certifications</AccordionTrigger>
        <AccordionContent className="space-y-4">
          {certificationFields.map((field, index) => (
             <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Certification {index + 1}</CardTitle>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeCertification(index)}><Trash2 size={16} /></Button>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name={`certifications.${index}.name`} render={({ field }) => <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                <FormField control={form.control} name={`certifications.${index}.issuer`} render={({ field }) => <FormItem><FormLabel>Issuer</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
              </CardContent>
            </Card>
          ))}
          <Button variant="outline" size="sm" onClick={() => appendCertification({ name: "", issuer: "" })}><Plus className="mr-2 h-4 w-4" /> Add Certification</Button>
        </AccordionContent>
      </AccordionItem>
    ),
    achievements: (
       <AccordionItem value="achievements" key="achievements">
        <AccordionTrigger className="font-headline text-lg">Achievements / Highlights</AccordionTrigger>
        <AccordionContent>
          <FormField control={form.control} name="achievements.points" render={({ field }) => <FormItem><FormLabel>Highlights</FormLabel><FormControl><Textarea {...field} placeholder="Use bullet points, one per line" /></FormControl></FormItem>} />
        </AccordionContent>
      </AccordionItem>
    )
  };

  const sectionPreviewMap: Record<keyof Omit<ResumeData, "header">, React.ReactNode> = {
    education: watchedData.education?.length > 0 && (
      <section key="education">
        <h2 className="font-headline text-xl font-bold border-b-2 border-primary/50 pb-1 mb-3">Education</h2>
        {watchedData.education.map((edu, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-base">{edu.degree}</h3>
              <p className="text-sm text-muted-foreground">{edu.year}</p>
            </div>
            <p className="text-sm">{edu.university}{edu.institute && `, ${edu.institute}`}</p>
            {edu.specialization && <p className="text-sm">Specialization: {edu.specialization}</p>}
            {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
          </div>
        ))}
      </section>
    ),
    skills: watchedData.skills?.length > 0 && (
      <section key="skills">
        <h2 className="font-headline text-xl font-bold border-b-2 border-primary/50 pb-1 mb-3">Skills</h2>
        <div className="text-sm space-y-1">
          {watchedData.skills.map((skill, i) => (
            skill.name && skill.keywords && <p key={i}><strong>{skill.name}:</strong> {skill.keywords}</p>
          ))}
        </div>
      </section>
    ),
    experience: watchedData.experience?.length > 0 && (
      <section key="experience">
        <h2 className="font-headline text-xl font-bold border-b-2 border-primary/50 pb-1 mb-3">Work Experience</h2>
        {watchedData.experience.map((exp, i) => (
          <div key={i} className="mb-3">
             <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-base">{exp.title} at {exp.company}</h3>
                <p className="text-sm text-muted-foreground">{exp.duration}</p>
              </div>
              <ul className="list-disc list-inside text-sm mt-1">
                {exp.responsibilities?.split('\n').map((line, j) => line.trim() && <li key={j}>{line.replace(/^- /, '')}</li>)}
              </ul>
          </div>
        ))}
      </section>
    ),
    projects: watchedData.projects?.length > 0 && (
      <section key="projects">
        <h2 className="font-headline text-xl font-bold border-b-2 border-primary/50 pb-1 mb-3">Projects</h2>
        {watchedData.projects.map((proj, i) => (
           <div key={i} className="mb-3">
             <h3 className="font-bold text-base">{proj.name}</h3>
             <p className="text-sm">{proj.description}</p>
             <p className="text-sm"><strong>Tech Stack:</strong> {proj.techStack}</p>
           </div>
        ))}
      </section>
    ),
    certifications: watchedData.certifications?.length > 0 && (
      <section key="certifications">
        <h2 className="font-headline text-xl font-bold border-b-2 border-primary/50 pb-1 mb-3">Certifications</h2>
         <ul className="list-disc list-inside text-sm">
          {watchedData.certifications.map((cert, i) => (
            <li key={i}>{cert.name}{cert.issuer && ` - ${cert.issuer}`}</li>
          ))}
        </ul>
      </section>
    ),
    achievements: watchedData.achievements?.points && (
      <section key="achievements">
        <h2 className="font-headline text-xl font-bold border-b-2 border-primary/50 pb-1 mb-3">Achievements</h2>
        <ul className="list-disc list-inside text-sm">
          {watchedData.achievements.points.split('\n').map((line, j) => line.trim() && <li key={j}>{line.replace(/^- /, '')}</li>)}
        </ul>
      </section>
    ),
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="p-4 md:p-8 md:overflow-y-auto md:h-screen print-hidden">
          <header className="mb-8">
            <h1 className="font-headline text-3xl font-bold text-primary">ResumeForge</h1>
            <p className="text-muted-foreground">Fill in your details and see your resume come to life.</p>
          </header>

          <div className="flex gap-2 mb-6 print-hidden">
            <Button onClick={handleOptimizeOrder} disabled={isOptimizing}>
              {isOptimizing ? "Optimizing..." : <><Sparkles className="mr-2 h-4 w-4" /> Optimize with AI</>}
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>

          <Form {...form}>
            <form className="space-y-4">
              <Accordion type="multiple" defaultValue={["header", ...orderedSections]} className="w-full">
                <AccordionItem value="header">
                  <AccordionTrigger className="font-headline text-lg">Header</AccordionTrigger>
                  <AccordionContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField control={form.control} name="header.name" render={({ field }) => <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="header.role" render={({ field }) => <FormItem><FormLabel>Role / Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="header.location" render={({ field }) => <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                    <FormField control={form.control} name="header.phone" render={({ field }) => <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                    <FormField control={form.control} name="header.email" render={({ field }) => <FormItem className="md:col-span-2"><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
                    <FormField control={form.control} name="header.linkedin" render={({ field }) => <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                    <FormField control={form.control} name="header.github" render={({ field }) => <FormItem><FormLabel>GitHub URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                    <FormField control={form.control} name="header.portfolio" render={({ field }) => <FormItem><FormLabel>Portfolio URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>} />
                  </AccordionContent>
                </AccordionItem>
                {orderedSections.map(section => sectionFormMap[section])}
              </Accordion>
            </form>
          </Form>
        </div>

        <div className="bg-gray-300 p-4 md:p-8 md:overflow-y-auto md:h-screen">
          <div className="bg-white shadow-2xl rounded-lg p-8 mx-auto max-w-4xl aspect-[8.5/11] print-visible" id="resume-preview">
            {/* Resume Preview */}
            <header className="text-center mb-6">
              <h1 className="font-headline text-3xl font-bold">{watchedData.header?.name}</h1>
              <p className="text-primary font-semibold text-lg">{watchedData.header?.role}</p>
              <div className="flex justify-center items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-2 flex-wrap">
                {watchedData.header?.location && <span className="flex items-center gap-1">{watchedData.header.location}</span>}
                {watchedData.header?.phone && <span className="flex items-center gap-1"><Phone size={12}/>{watchedData.header.phone}</span>}
                {watchedData.header?.email && <a href={`mailto:${watchedData.header.email}`} className="flex items-center gap-1 hover:text-primary"><Mail size={12}/>{watchedData.header.email}</a>}
                {watchedData.header?.linkedin && <a href={watchedData.header.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary"><Linkedin size={12}/>LinkedIn</a>}
                {watchedData.header?.github && <a href={watchedData.header.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary"><Github size={12}/>GitHub</a>}
                {watchedData.header?.portfolio && <a href={watchedData.header.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary"><Globe size={12}/>Portfolio</a>}
              </div>
            </header>

            <main className="space-y-5">
              {orderedSections.map(section => sectionPreviewMap[section])}
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
