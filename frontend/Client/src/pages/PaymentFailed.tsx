import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaymentFailed = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-destructive">
              Payment Failed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your payment did not complete. Please try again with a valid card
              or use a different payment method.
            </p>
            <div className="flex gap-3">
              <Link to="/">
                <Button>Try Again</Button>
              </Link>
              <Link to="/my-courses">
                <Button variant="outline">Go to My Courses</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PaymentFailed;
