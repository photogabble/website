module.exports = {
  breadcrumbs: (data) => {
    if (!data.collections.all || data.collections.all.length === 0) return [];
    const crumbs = [
      {href: '/', text: '~', title: 'Back to homepage'}
    ];

    let folders = data?.folder ?? [];
    if (Array.isArray(folders) === false) folders = [folders];

    if (data?.contentType === 'project') folders = folders.filter(f => f !== 'writing');

    for (const folder of folders) {
      switch (folder) {
        case 'about':
          crumbs.push({href: '/about', text: 'about', title: 'Goto About page'});
          break;
        case 'types':
          crumbs.push({href: '/about/content', text: 'types', title: 'Goto Content Types info page'});
          break;
        case 'writing':
          crumbs.push({href: '/writing', text: 'writing', title: 'Goto Archive of all posts'});
          break;
        case 'topic':
          crumbs.push({href: '/topic', text: 'topics', title: 'Goto list of all topics'});
          break;
      }
    }

    if (data.contentType) {
      const found = data.collections.contentTypes.find(t => t.id === data.contentType);
      if (found) crumbs.push({
        href: `/${found.slug}`,
        text: found.name.toLowerCase(),
        title: `Goto Archive of all ${found.name}`
      })
    }
    return crumbs;
  }
}