export async function apiVincularTags(visita_id?: number, tag_ids?: number[]) {
  for (const tag_id of tag_ids || '') {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/vincular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
      body: JSON.stringify({ visita_id, tag_id }),
    });
  }
}
