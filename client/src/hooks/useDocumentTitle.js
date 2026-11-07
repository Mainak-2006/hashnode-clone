import { useEffect } from 'react';

const BASE_TITLE = 'Hashnode Clone';

export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${BASE_TITLE}` : BASE_TITLE;
  }, [title]);
}
