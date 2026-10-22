import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { UnfinishedPage } from "@/components/shell/UnfinishedPage";
import { routes } from "@/content/routes";
export const dynamicParams = false;
export function generateStaticParams() {
  return routes
    .filter((route) => route.path !== "/")
    .map((route) => ({ slug: route.path.slice(1).split("/") }));
}
type Props = { params: Promise<{ slug: string[] }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = routes.find((route) => route.path === `/${slug.join("/")}`);
  return { title: `${route?.label ?? "Unfinished page"} · Draft website` };
}
export default async function RegisteredPage({ params }: Props) {
  const { slug } = await params;
  const route = routes.find((route) => route.path === `/${slug.join("/")}`);
  if (!route) notFound();
  return <UnfinishedPage route={route} />;
}
