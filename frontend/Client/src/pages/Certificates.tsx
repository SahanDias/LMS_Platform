import { useState } from "react";
import Header from "@/components/Header";
import CertificateCard from "@/components/CertificateCard";
import CertificateViewer from "@/components/CertificateViewer";
import { certificates, Certificate } from "@/lib/data";
import { Award } from "lucide-react";

const Certificates = () => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleViewCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsViewerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">My Certificates</h1>
          <p className="text-muted-foreground">
            View and download your earned certificates
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Award className="mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">
              No certificates yet
            </p>
            <p className="text-muted-foreground">
              Complete a course to earn your first certificate
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <CertificateCard
                key={certificate.id}
                certificate={certificate}
                onView={() => handleViewCertificate(certificate)}
              />
            ))}
          </div>
        )}
      </main>

      <CertificateViewer
        certificate={selectedCertificate}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </div>
  );
};

export default Certificates;
