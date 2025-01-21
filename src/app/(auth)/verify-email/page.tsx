/* eslint-disable */
// @ts-nocheck

import { verifyEmail } from "@/app/actions/authActions";
import CardWrapper from "@/components/CardWrapper";
import ResultMessage from "@/components/ResultMessage";
import { MdOutlineMailOutline } from "react-icons/md";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }; // Более гибкий тип
}) {
  if (!searchParams?.token) {
    throw new Error("Token is missing in searchParams");
  }

  const result = await verifyEmail(searchParams.token);

  return (
    <CardWrapper
      headerText="Verify your email address"
      headerIcon={MdOutlineMailOutline}
      footer={<ResultMessage result={result} />}
    />
  );
}
