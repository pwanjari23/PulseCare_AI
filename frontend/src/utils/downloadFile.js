export const downloadFile = (url, fileName) => {
  if (!url) return;
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName || 'download');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default downloadFile;
