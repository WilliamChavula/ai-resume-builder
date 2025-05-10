import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { steps } from "./steps";

type BreadCrumbsProps = {
  currentStep: string;
  setCurrentStep: (step: string) => void;
};

const BreadCrumbs = ({ currentStep, setCurrentStep }: BreadCrumbsProps) => (
  <div className="flex justify-center">
    <Breadcrumb>
      <BreadcrumbList>
        {steps.map((item) => (
          <Fragment key={item.key}>
            <BreadcrumbItem>
              {item.key === currentStep ? (
                <BreadcrumbPage>{item.title}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <button onClick={() => setCurrentStep(item.key)}>
                    {item.title}
                  </button>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator className="last:hidden" />
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  </div>
);

export default BreadCrumbs;
