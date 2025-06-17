export function formatPostTimestamp(isoDate: string): string {
    const postDate = new Date(isoDate);

      return postDate.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

  }
  