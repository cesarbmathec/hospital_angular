const baseUrl = 'http://192.168.0.105:8000/';

export const environment = {
  production: false,
  baseUrl: baseUrl,
  authUrl: baseUrl + 'api/token/',
  pacienteUrl: baseUrl + 'historias_medicas/paciente/',
  medicoUrl: baseUrl + 'historias_medicas/medico/',
  consultaUrl: baseUrl + 'historias_medicas/consulta/',
  historiaClinicaUrl: baseUrl + 'historias_medicas/historia_clinica/',
  medicamentoUrl: baseUrl + 'historias_medicas/medicamento/',
  prescripcionUrl: baseUrl + 'historias_medicas/prescripcion/',
};
