import { getLLMText, source } from '@/lib/source';
import { notFound } from 'next/navigation';

export const revalidate = false;

interface RouteParams {
  slug?: string[];
}

export async function GET(_req: Request, { params }: { params: Promise<RouteParams> }) {
  const { slug } = await params;
  // the root page is exported as /llms.mdx/index, since a plain /llms.mdx
  // file would conflict with the /llms.mdx/* directory in static export
  const page = source.getPage(slug?.length === 1 && slug[0] === 'index' ? [] : slug);
  if (!page) notFound();

  return new Response(await getLLMText(page), {
    headers: {
      'Content-Type': 'text/markdown',
    },
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: page.slugs.length === 0 ? ['index'] : [...page.slugs],
  }));
}
