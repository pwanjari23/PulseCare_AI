// Pages
export { DoctorNotesPage } from './pages/DoctorNotesPage';
export { DoctorNoteDetailsPage } from './pages/DoctorNoteDetailsPage';
export { CreateDoctorNotePage } from './pages/CreateDoctorNotePage';
export { EditDoctorNotePage } from './pages/EditDoctorNotePage';
export { PatientDoctorNotesPage } from './pages/PatientDoctorNotesPage';

// Components
export { DoctorNoteCard } from './components/DoctorNoteCard';
export { DoctorNoteTable } from './components/DoctorNoteTable';
export { DoctorNoteTimeline } from './components/DoctorNoteTimeline';
export { DoctorNoteSummary } from './components/DoctorNoteSummary';
export { DoctorNoteStatusBadge } from './components/DoctorNoteStatusBadge';
export { DoctorNoteFilters } from './components/DoctorNoteFilters';
export { DoctorNoteSearchBar } from './components/DoctorNoteSearchBar';
export { DoctorNoteForm } from './components/DoctorNoteForm';
export { ClinicalAssessmentSection } from './components/ClinicalAssessmentSection';
export { DiagnosisSection } from './components/DiagnosisSection';
export { SymptomsSection } from './components/SymptomsSection';
export { ExaminationSection } from './components/ExaminationSection';
export { FollowUpSection } from './components/FollowUpSection';
export { AdviceSection } from './components/AdviceSection';
export { DoctorNotePreview } from './components/DoctorNotePreview';
export { DoctorNoteEmptyState } from './components/DoctorNoteEmptyState';
export { DoctorNoteSkeleton } from './components/DoctorNoteSkeleton';
export { DeleteDoctorNoteDialog } from './components/DeleteDoctorNoteDialog';

// Hooks
export { useDoctorNotes } from './hooks/useDoctorNotes';
export { useDoctorNote } from './hooks/useDoctorNote';
export { usePatientDoctorNotes } from './hooks/usePatientDoctorNotes';
export { useCreateDoctorNote } from './hooks/useCreateDoctorNote';
export { useUpdateDoctorNote } from './hooks/useUpdateDoctorNote';
export { useDeleteDoctorNote } from './hooks/useDeleteDoctorNote';

// API, Constants & Utils
export { doctorNoteApi } from './api/doctorNote.api';
export { NOTE_STATUS, NOTE_STATUS_CONFIG, CONSULTATION_TYPES } from './constants/doctorNote.constants';
export { formatNoteDate, generateNoteCode, filterDoctorNotes, parseNoteContentSections } from './utils/doctorNote.utils';
