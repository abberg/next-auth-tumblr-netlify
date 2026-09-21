import { auth } from '@/auth';
import { notFound, redirect } from 'next/navigation';
import { CursorProbe } from './probe';

export default async function DashboardCursorExperiment() {
  if (process.env.NODE_ENV !== 'development') notFound();
  if (!(await auth())) redirect('/login');
  return <CursorProbe />;
}
