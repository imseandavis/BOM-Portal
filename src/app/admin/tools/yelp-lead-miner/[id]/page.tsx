import { use } from 'react';
import YelpLeadResultsClient from './YelpLeadResultsClient';

export default function YelpLeadResultsPage({ params }: { params: { id: string } }) {
  const id = use(Promise.resolve(params.id));
  return <YelpLeadResultsClient id={id} />;
} 