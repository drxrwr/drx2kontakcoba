document.getElementById('processFilesBtn').addEventListener('click', function () {
    const files = document.getElementById('file-input').files;
    const contactName1 = document.getElementById('contactName1Input').value.trim();
    const contactName2 = document.getElementById('contactName2Input').value.trim();

    if (!contactName1 || !contactName2) {
        alert('Harap mengisi nama kontak 1 dan kontak 2.');
        return;
    }

    const fileAreas = document.getElementById('file-areas');
    fileAreas.innerHTML = ''; // Kosongkan area sebelumnya

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const lines = e.target.result.split('\n').map(line => line.trim()).filter(Boolean);
            if (lines.length === 0) return;

            const originalFileName = file.name.replace(/\.[^/.]+$/, ''); // Nama file asli tanpa ekstensi
            const firstNumber = lines[0].replace(/^[^0-9+]+/, ''); // Nomor pertama
            const otherNumbers = lines.slice(1);

            const container = document.createElement('div');
            container.classList.add('file-container');

            // Input untuk nama file kontak pertama
            const adminFileInput = document.createElement('input');
            adminFileInput.type = 'text';
            adminFileInput.value = `ADMIN_${originalFileName}`;
            adminFileInput.placeholder = 'Nama file untuk kontak pertama';
            container.appendChild(adminFileInput);

            // Tombol download kontak pertama
            const adminDownloadBtn = document.createElement('button');
            adminDownloadBtn.textContent = 'Download Kontak Pertama';
            adminDownloadBtn.addEventListener('click', () => {
                const adminFileName = adminFileInput.value.trim() || `ADMIN_${originalFileName}.vcf`;
                const adminVcfContent = `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName1}\nTEL:${formatPhoneNumber(firstNumber)}\nEND:VCARD\n`;
                downloadFile(adminVcfContent, `${adminFileName}.vcf`);
            });
            container.appendChild(adminDownloadBtn);

            // Input untuk nama file kontak kedua dan seterusnya
            if (otherNumbers.length > 0) {
                const otherFileInput = document.createElement('input');
                otherFileInput.type = 'text';
                otherFileInput.value = `${originalFileName}`;
                otherFileInput.placeholder = 'Nama file untuk kontak kedua dan seterusnya';
                container.appendChild(otherFileInput);

                // Tombol download kontak kedua dan seterusnya
                const otherDownloadBtn = document.createElement('button');
                otherDownloadBtn.textContent = 'Download Kontak Kedua+';
                otherDownloadBtn.addEventListener('click', () => {
                    const otherFileName = otherFileInput.value.trim() || `${originalFileName}.vcf`;
                    let vcfContent = '';
                    otherNumbers.forEach((number, index) => {
                        vcfContent += `BEGIN:VCARD\nVERSION:3.0\nFN:${contactName2} ${index + 1}\nTEL:${formatPhoneNumber(number)}\nEND:VCARD\n`;
                    });
                    downloadFile(vcfContent, `${otherFileName}.vcf`);
                });
                container.appendChild(otherDownloadBtn);
            }

            fileAreas.appendChild(container);
        };
        reader.readAsText(file);
    });
});

function formatPhoneNumber(number) {
    if (!number.startsWith('+')) {
        return `+${number}`;
    }
    return number;
}

function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
                          }
