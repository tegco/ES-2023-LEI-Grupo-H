import { csvParse } from 'd3-dsv';

export const processFile = async (file, setTempEvents) => {
console.log('processFile: ' + file);

// Read the file and parse based on the format
const reader = new FileReader();
reader.onload = async (event) => {
    const fileContent = event.target.result;

    // Check the file's type (MIME type)
    const isJSON = file.type === 'application/json';
    const isCSV = file.type === 'text/csv';
    
    let parsedData;

    if (isJSON) {
    parsedData = JSON.parse(fileContent);
    } else if (isCSV) {
    parsedData = csvParse(fileContent);
    } else {
    console.error('Unsupported file format.');
    alert('Unsupported file format. Please upload a JSON or CSV file.');
    return;
    }

    const calendarEvents = parsedData.map((event) => {
    return {
        title: event['Unidade Curricular'],
        start: convertDateFormat(event['Data da aula']) + 'T' + event['Hora início da aula'],
        end: convertDateFormat(event['Data da aula']) + 'T' + event['Hora fim da aula'],
        extendedProps: {
        curso: event['Curso'],
        turno: event['Turno'],
        turma: event['Turma'],
        inscritos: event['Inscritos no turno'],
        diaSemana: event['Dia da semana'],
        dataAula: event['Data da aula'],
        sala: event['Sala atribuída à aula'],
        lotacao: event['Lotação da sala'],
        },
    };
    });

    setTempEvents(calendarEvents);
};

reader.readAsText(file);
};

const convertDateFormat = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }