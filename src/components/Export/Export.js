


const downloadFile = ({ data, fileName, fileType }) => {
    const blob = new Blob([data], { type: fileType });
    const a = document.createElement('a');
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt);
    a.remove();
}

const handleSave = (event) => {
    console.log(data);
    event.preventDefault()

    let dataToExport = [];
    data.forEach(element => {
        dataToExport.push(element);
    });

    downloadFile({
        data: JSON.stringify(dataToExport),
        fileName: 'data.json',
        fileType: 'text/json',
    });
}