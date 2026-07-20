"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { jsPDF } from "jspdf";
import { Download, FolderOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects', { method: 'GET' });
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        }
        
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const generatePDF = (project: any) => {
    const report = project.reportData;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text("Awsaf Hub - Saved Report", 20, 20);
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text(`Project: ${project.name}`, 20, 28);

    doc.setTextColor(15, 23, 42);
    let y = 50;

    const addSection = (title: string, content: string) => {
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(13);
      doc.setTextColor(37, 99, 235);
      doc.text(title, 20, y);
      y += 7;
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(content, 170);
      doc.text(lines, 20, y);
      y += lines.length * 5 + 5;
    };

    // Re-use the saved data to build the PDF
    addSection("1. Niche & Market Route", `Best Route: ${report.niche?.best_route || 'N/A'}\nPersona: ${report.niche?.audience_persona || 'N/A'}`);
    addSection("2. SEO Strategy", `Keywords: ${report.seo?.primary_keywords?.join(', ') || 'N/A'}\nStrategy: ${report.seo?.content_strategy || 'N/A'}`);
    addSection("3. ROAS Projections", `Platform: ${report.platform}\nExpected ROAS: ${report.roas?.expected_roas || 'N/A'}\nExpected CPA: ${report.roas?.expected_cpa || 'N/A'}`);
    
    if (report.business) {
      addSection("4. Market Analysis", `Market Size: ${report.business.market_size || 'N/A'}\nTrends: ${report.business.market_trends?.join(', ') || 'N/A'}`);
      // Add competitor page logic here if desired, keeping it simple for this view
    }
    
    if (report.budget) {
      addSection("5. Budget & Launch", `Total Range: ${report.budget.total_min_budget || 'N/A'} - ${report.budget.total_max_budget || 'N/A'}`);
    }

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Powered by AWSAFTRADING LLC", 20, 290);

    doc.save(`Saved_Report_${project.name.replace(/\s/g, '_')}.pdf`);
  };
  console.log("Projects:", projects);

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-500 text-sm">View and download your saved business reports.</p>
          </div>
          <Link href="/dashboard">
            <Button className="bg-slate-900 hover:bg-slate-800">
              + New Report
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : projects.length === 0 ? (
          <Card className="p-12 flex flex-col items-center justify-center border-dashed border-slate-300 bg-slate-50">
            <FolderOpen className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900 mb-1">No projects yet</h3>
            <p className="text-slate-500 text-sm mb-6">Generate a new report and save it to see it here.</p>
            <Link href="/dashboard">
              <Button className="bg-slate-900 hover:bg-slate-800">Create First Report</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="p-6 flex flex-col justify-between shadow-sm border-slate-200 hover:shadow-md transition-shadow">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">{project.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Expected ROAS:</span>
                      <span className="font-bold text-slate-900">{project.reportData?.roas?.expected_roas || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Budget Range:</span>
                      <span className="font-bold text-slate-900">{project.reportData?.budget?.total_min_budget || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={() => generatePDF(project)} variant="outline" className="w-full border-slate-300 hover:bg-slate-100">
                  <Download size={16} className="mr-2" /> Download PDF
                </Button>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}