import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useTheme } from '../contexts/ThemeProvider';
import {
  Button,
  Input,
  Select,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormSwitch,
  FormRadioGroup,
  Badge,
  Alert,
  EmptyState,
  Progress,
  StatusChip,
  toast,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Avatar,
  StatCard,
  MetricCard,
  InfoCard,
  Breadcrumb,
  Pagination,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  PageHeader,
  Modal,
  Drawer,
  ConfirmationDialog,
  ResponsiveTable,
  Spinner,
  SkeletonCard,
  SkeletonTable,
  SkeletonProfile,
  SkeletonDashboard,
  Stack,
  Grid,
  Container,
  Divider,
  Spacer
} from '../components/ui';

import * as Icons from '../components/icons';

export const DesignSystem = () => {
  const { theme, setTheme } = useTheme();

  // Overlay states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerAnchor, setDrawerAnchor] = useState('right');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting state for table
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  // React Hook Form setup
  const methods = useForm({
    defaultValues: {
      fullName: '',
      emailAddress: '',
      department: '',
      agreeToTerms: false,
      notifications: true,
      userRole: 'viewer'
    }
  });

  const onSubmit = (data) => {
    toast.success(`Form submitted successfully: ${JSON.stringify(data)}`);
  };

  // Mock Table Data
  const tableData = [
    { id: 1, name: 'Dr. Sarah Connor', specialty: 'Cardiology', status: 'Active', load: 88 },
    { id: 2, name: 'Dr. Bruce Banner', specialty: 'Endocrinology', status: 'Away', load: 62 },
    { id: 3, name: 'Dr. Stephen Strange', specialty: 'Neurosurgery', status: 'Active', load: 95 },
    { id: 4, name: 'Dr. Pamela Isley', specialty: 'Toxicology', status: 'Offline', load: 24 },
  ];

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    toast.info(`Sorted by ${key} (${direction})`);
  };

  return (
    <Container className="py-10 max-w-6xl">
      <PageHeader
        title="PulseCare AI UI System Playground"
        subtitle="Complete production-grade Design System sandbox showcasing every component, theme configuration, and interaction state."
        breadcrumbItems={[{ label: 'Design System' }]}
        actions={
          <Stack direction="row" spacing={2} align="center" className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg border border-border-light">
            <Button
              variant={theme === 'light' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('light')}
              leftIcon={Icons.IconSparkles}
            >
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('dark')}
              leftIcon={Icons.IconClock}
            >
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setTheme('system')}
              leftIcon={Icons.IconSettings}
            >
              System
            </Button>
          </Stack>
        }
      />

      <Tabs defaultValue="tokens" className="mt-8">
        <TabsList className="overflow-x-auto flex whitespace-nowrap scrollbar-none pb-0">
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="overlays">Overlays</TabsTrigger>
          <TabsTrigger value="tables">Tables & Loaders</TabsTrigger>
          <TabsTrigger value="layout">Layout & Icons</TabsTrigger>
        </TabsList>

        {/* TOKENS PANEL */}
        <TabsContent value="tokens" className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Color Tokens</h2>
            <Grid cols={2} colsMd={4} gap={4}>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="h-12 w-full bg-primary-600 rounded-md" />
                  <span className="font-semibold text-xs text-text-primary">Primary 600</span>
                  <span className="text-[10px] text-text-muted">var(--color-primary-600)</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="h-12 w-full bg-secondary-500 rounded-md" />
                  <span className="font-semibold text-xs text-text-primary">Secondary 500</span>
                  <span className="text-[10px] text-text-muted">var(--color-secondary-500)</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="h-12 w-full bg-success-600 rounded-md" />
                  <span className="font-semibold text-xs text-text-primary">Success 600</span>
                  <span className="text-[10px] text-text-muted">var(--color-success-600)</span>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="h-12 w-full bg-danger-600 rounded-md" />
                  <span className="font-semibold text-xs text-text-primary">Danger 600</span>
                  <span className="text-[10px] text-text-muted">var(--color-danger-600)</span>
                </CardContent>
              </Card>
            </Grid>
            
            <h3 className="text-sm font-semibold text-text-secondary mt-4">Semantic Backgrounds & Borders</h3>
            <Grid cols={2} colsMd={4} gap={4}>
              <div className="p-4 rounded-xl border border-border-light bg-bg-page flex flex-col justify-between h-20">
                <span className="text-xs text-text-secondary font-medium">Page Background</span>
                <code className="text-[10px] text-text-muted">bg-bg-page</code>
              </div>
              <div className="p-4 rounded-xl border border-border-light bg-bg-card flex flex-col justify-between h-20">
                <span className="text-xs text-text-secondary font-medium">Card Background</span>
                <code className="text-[10px] text-text-muted">bg-bg-card</code>
              </div>
              <div className="p-4 rounded-xl border border-border-medium bg-bg-card flex flex-col justify-between h-20">
                <span className="text-xs text-text-secondary font-medium">Medium Border</span>
                <code className="text-[10px] text-text-muted">border-border-medium</code>
              </div>
              <div className="p-4 rounded-xl border border-border-light bg-bg-sidebar flex flex-col justify-between h-20">
                <span className="text-xs text-text-secondary font-medium">Sidebar Background</span>
                <code className="text-[10px] text-text-muted">bg-bg-sidebar</code>
              </div>
            </Grid>
          </section>

          <Divider />

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Typography Hierarchy</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <span className="text-xs text-text-muted block mb-1">Display</span>
                  <h1 className="text-display font-bold text-text-primary leading-tight">Inter Display Bold 40px</h1>
                </div>
                <Divider />
                <div>
                  <span className="text-xs text-text-muted block mb-1">Heading 1</span>
                  <h2 className="text-h1 font-bold text-text-primary leading-tight">Heading 1 Bold 32px</h2>
                </div>
                <Divider />
                <div>
                  <span className="text-xs text-text-muted block mb-1">Heading 2</span>
                  <h3 className="text-h2 font-semibold text-text-primary">Heading 2 Semibold 24px</h3>
                </div>
                <Divider />
                <div>
                  <span className="text-xs text-text-muted block mb-1">Heading 3</span>
                  <h4 className="text-h3 font-semibold text-text-primary">Heading 3 Semibold 20px</h4>
                </div>
                <Divider />
                <div>
                  <span className="text-xs text-text-muted block mb-1">Body Large</span>
                  <p className="text-body-large text-text-secondary">Body Large Regular 18px text. Premium and spacious text layout suitable for descriptions.</p>
                </div>
                <Divider />
                <div>
                  <span className="text-xs text-text-muted block mb-1">Body Medium</span>
                  <p className="text-body-medium text-text-secondary">Body Medium Regular 16px text. Standard layout text for cards and lists.</p>
                </div>
                <Divider />
                <div>
                  <span className="text-xs text-text-muted block mb-1">Body Small / Label</span>
                  <p className="text-body-small text-text-secondary">Body Small Regular 14px text. Used for inputs and smaller details.</p>
                </div>
                <Divider />
                <div>
                  <span className="text-xs text-text-muted block mb-1">Caption</span>
                  <p className="text-caption text-text-muted">Caption Regular 12px text. Underlines, dates, and side info.</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </TabsContent>

        {/* BUTTONS PANEL */}
        <TabsContent value="buttons" className="space-y-6">
          <Card>
            <CardHeader title="Button Variants" subtitle="All styles are medical-grade, professional, and support focus rings." />
            <CardContent className="p-6">
              <Stack direction="row" wrap spacing={4}>
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Button Sizes" />
            <CardContent className="p-6">
              <Stack direction="row" align="center" spacing={4}>
                <Button variant="primary" size="sm">Small Size</Button>
                <Button variant="primary" size="md">Medium Size</Button>
                <Button variant="primary" size="lg">Large Size</Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Button States" subtitle="Interactive loading spinner and full width configurations." />
            <CardContent className="p-6 space-y-4">
              <Stack direction="row" wrap spacing={4}>
                <Button variant="primary" loading>Saving Info</Button>
                <Button variant="outline" disabled>Disabled State</Button>
                <Button variant="outline" leftIcon={Icons.IconPlus}>Add Entry</Button>
                <Button variant="primary" rightIcon={Icons.IconArrowRight}>Next Page</Button>
              </Stack>
              <Divider />
              <Button variant="secondary" fullWidth>Full Width Button</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FORMS PANEL */}
        <TabsContent value="forms" className="space-y-6">
          <Card>
            <CardHeader title="Form Inputs & Toggles" subtitle="Built with focus states, labels, errors, and customizable helper text." />
            <CardContent className="p-6">
              <Grid cols={1} colsMd={2} gap={6}>
                <Input label="Full Name" placeholder="Jane Doe" required helperText="Provide your full display name." />
                <Input label="Email" type="email" placeholder="jane@pulsecare.ai" required />
                <Input label="Password" type="password" placeholder="Enter secure key" />
                <Input label="Search Records" type="search" placeholder="Search patients..." />
                <Input label="Doctor Bio" type="textarea" placeholder="Describe clinical experience..." />
                <Select
                  label="Department Specialty"
                  placeholder="Select specialty..."
                  options={[
                    { value: 'cardiology', label: 'Cardiology' },
                    { value: 'pediatrics', label: 'Pediatrics' },
                    { value: 'neurology', label: 'Neurology' },
                  ]}
                />
                
                <Stack spacing={4}>
                  <Checkbox label="Agree to medical data sharing regulations" helperText="HIPAA compliance requirement." />
                  <Checkbox label="Mark as active clinician" checked disabled />
                </Stack>

                <Stack spacing={4}>
                  <Switch label="Enable Real-Time Alerts" helperText="Sends urgent notification pulses." checked />
                  <Switch label="Away Mode" />
                </Stack>

                <RadioGroup label="Select Access Class" name="accessLevel" defaultValue="read">
                  <RadioGroupItem value="read" label="Read Only Access" description="View patient charts without modification." />
                  <RadioGroupItem value="edit" label="Clinical Editor" description="Update prescriptions and vitals." />
                  <RadioGroupItem value="admin" label="Administrator privileges" description="Add/Remove practitioners and settings." />
                </RadioGroup>
              </Grid>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="React Hook Form Integration" subtitle="Consumes forms foundation with native validation." />
            <CardContent className="p-6">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                  <Grid cols={1} colsMd={2} gap={6}>
                    <FormInput
                      name="fullName"
                      label="Practitioner Full Name"
                      placeholder="e.g. Dr. John Watson"
                      required
                    />
                    <FormInput
                      name="emailAddress"
                      label="Work Email Address"
                      placeholder="watson@pulsecare.ai"
                      required
                    />
                    <FormSelect
                      name="department"
                      label="Specialty Department"
                      placeholder="Choose option..."
                      options={[
                        { value: 'gp', label: 'General Practice' },
                        { value: 'er', label: 'Emergency Room' },
                        { value: 'icu', label: 'Intensive Care Unit' },
                      ]}
                      required
                    />
                    <FormRadioGroup name="userRole" label="Practitioner Level">
                      <RadioGroupItem value="viewer" label="Resident MD" />
                      <RadioGroupItem value="attending" label="Attending Physician" />
                    </FormRadioGroup>
                  </Grid>

                  <FormCheckbox
                    name="agreeToTerms"
                    label="I verify the clinical credentials provided are authentic"
                    required
                  />

                  <FormSwitch
                    name="notifications"
                    label="Send SMS notifications for critical vitals"
                  />

                  <Stack direction="row" justify="end" spacing={3}>
                    <Button variant="outline" size="sm" onClick={() => methods.reset()}>
                      Reset Fields
                    </Button>
                    <Button variant="primary" size="sm" type="submit">
                      Register Practitioner
                    </Button>
                  </Stack>
                </form>
              </FormProvider>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FEEDBACK PANEL */}
        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader title="Badges & Status Chips" />
            <CardContent className="p-6">
              <Stack spacing={4}>
                <Stack direction="row" spacing={3} wrap>
                  <Badge variant="neutral">Neutral Badge</Badge>
                  <Badge variant="info">Info Badge</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning Alert</Badge>
                  <Badge variant="danger">Danger Ring</Badge>
                </Stack>
                <Divider />
                <Stack direction="row" spacing={3} wrap>
                  <StatusChip status="neutral" label="Offline Status" />
                  <StatusChip status="info" label="Incoming Referral" />
                  <StatusChip status="success" label="Clinician Online" />
                  <StatusChip status="warning" label="Pending Sync" />
                  <StatusChip status="danger" label="Critical Vitals Alert" />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Alert Messages" />
            <CardContent className="p-6 space-y-4">
              <Alert variant="info" title="System Maintenance" description="System will undergo database optimizations tonight at 12:00 AM EST. Modest lag expected." onClose={() => {}} />
              <Alert variant="success" title="Practitioner Synced" description="Credentials successfully registered and synced with Central NPI registry." onClose={() => {}} />
              <Alert variant="warning" title="Incomplete Record" description="Patient chart missing billing address and insurance validation signature." onClose={() => {}} />
              <Alert variant="danger" title="Critical Alert Triggered" description="Hyper-vitals recorded: patient heart pulse rate exceeded 120 bpm." onClose={() => {}} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Interactive Progress Indicators & Toasts" />
            <CardContent className="p-6 space-y-6">
              <Progress value={72} showValue variant="primary" />
              <Progress value={90} variant="success" size="lg" />
              <Progress value={35} variant="danger" size="sm" />
              
              <Divider />
              
              <Stack direction="row" spacing={3} wrap>
                <Button variant="outline" size="sm" onClick={() => toast.success('Patient chart saved successfully.')}>
                  Trigger Success Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.error('NPI authentication failed.')}>
                  Trigger Error Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.warning('Insurance coverage is expiring.')}>
                  Trigger Warning Toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info('System updates completed.')}>
                  Trigger Info Toast
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Empty State Component" />
            <CardContent className="p-6">
              <EmptyState
                title="No Prescriptions Uploaded"
                description="Upload prescription PDF summaries to map current pharmaceutical loads to patient records."
                actionText="Upload Prescription"
                onActionClick={() => toast.info('Prescription file dialog opened.')}
                actionIcon={Icons.IconUpload}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* DISPLAY PANEL */}
        <TabsContent value="display" className="space-y-6">
          <Grid cols={1} colsMd={3} gap={6}>
            <StatCard
              title="Active Consultations"
              value="128"
              change="+14.2%"
              trend="up"
              changeLabel="from last week"
              icon={Icons.IconUserCheck}
            />
            <StatCard
              title="Emergency Incidents"
              value="4"
              change="-25%"
              trend="down"
              changeLabel="vs yesterday"
              icon={Icons.IconShieldAlert}
            />
            <StatCard
              title="Clinical Queue Load"
              value="92%"
              change="Stable"
              trend="neutral"
              changeLabel="capacity buffer"
              icon={Icons.IconClock}
            />
          </Grid>

          <Grid cols={1} colsMd={2} gap={6}>
            <MetricCard title="Cardiac Recovery Index" value="78 / 100" progress={78} color="success" subtitle="Calculated from baseline resting heart rates" />
            <MetricCard title="Weekly Diagnostics Backlog" value="12 Charts" progress={30} color="danger" subtitle="Action required before billing submission" />
          </Grid>

          <Grid cols={1} colsMd={2} gap={6}>
            <InfoCard title="Primary Care Coordinator" description="Dr. Stephen Strange is assigned as the primary coordinator for patient vitals tracking." variant="info" />
            <InfoCard title="Incomplete NPI Validation" description="Practitioner license status validation is currently pending from NPI database." variant="warning" />
          </Grid>

          <Card>
            <CardHeader title="Avatars with Sizing and Status" />
            <CardContent className="p-6">
              <Stack direction="row" spacing={6} align="center">
                <Stack align="center" spacing={1}>
                  <Avatar size="sm" initials="JD" status="online" />
                  <span className="text-[10px] text-text-muted">Small (Online)</span>
                </Stack>
                <Stack align="center" spacing={1}>
                  <Avatar size="md" initials="AW" status="away" />
                  <span className="text-[10px] text-text-muted">Medium (Away)</span>
                </Stack>
                <Stack align="center" spacing={1}>
                  <Avatar size="lg" initials="DR" status="offline" />
                  <span className="text-[10px] text-text-muted">Large (Offline)</span>
                </Stack>
                <Stack align="center" spacing={1}>
                  <Avatar size="lg" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=256" alt="Doctor" status="online" />
                  <span className="text-[10px] text-text-muted">Image Avatar</span>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OVERLAYS PANEL */}
        <TabsContent value="overlays" className="space-y-6">
          <Card>
            <CardHeader title="Overlay Components" subtitle="Fully accessible modal dialogs and slide-out drawers." />
            <CardContent className="p-6">
              <Stack direction="row" spacing={4} wrap>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Open Animated Modal
                </Button>
                
                <Button variant="outline" onClick={() => { setDrawerAnchor('right'); setIsDrawerOpen(true); }}>
                  Open Right Drawer
                </Button>
                
                <Button variant="outline" onClick={() => { setDrawerAnchor('left'); setIsDrawerOpen(true); }}>
                  Open Left Drawer
                </Button>

                <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                  Confirmation Dialog
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* MODAL COMPONENT DEMO */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Edit Practitioner Account Info"
            footer={
              <>
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => { toast.success('Practitioner updated.'); setIsModalOpen(false); }}>
                  Save Changes
                </Button>
              </>
            }
          >
            <Stack spacing={4}>
              <p className="text-text-secondary text-xs">
                Update practitioner settings. All modifications require NPI license registry verification.
              </p>
              <Input label="Alternate Work Email" type="email" placeholder="watson@pulsecare.ai" />
              <Select
                label="Clinic Location Assignment"
                placeholder="Choose location..."
                options={[
                  { value: 'east', label: 'PulseCare East Wing' },
                  { value: 'west', label: 'PulseCare West Wing' },
                ]}
              />
            </Stack>
          </Modal>

          {/* DRAWER COMPONENT DEMO */}
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            anchor={drawerAnchor}
            title={drawerAnchor === 'left' ? 'Navigation Drawer' : 'Practitioner Diagnostic History'}
            footer={
              <Button variant="secondary" size="sm" fullWidth onClick={() => setIsDrawerOpen(false)}>
                Dismiss Panel
              </Button>
            }
          >
            <Stack spacing={5}>
              <div>
                <h4 className="font-semibold text-text-primary text-sm mb-2">Dr. Sarah Connor Log</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Clinical logs and consultation details sync directly with PulseCare systems. Review reports below.
                </p>
              </div>

              <Divider />

              <Stack spacing={3}>
                <div className="p-3 border border-border-light rounded-lg bg-gray-50/50 dark:bg-gray-800/10 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-text-primary">Vitals Check Log</span>
                    <span className="text-text-muted">10 mins ago</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">Patient ID #4401 blood rate record synced.</p>
                </div>

                <div className="p-3 border border-border-light rounded-lg bg-gray-50/50 dark:bg-gray-800/10 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-text-primary">EHR File Uploaded</span>
                    <span className="text-text-muted">1 hour ago</span>
                  </div>
                  <p className="text-[11px] text-text-secondary">Signature verification completed by Attending MD.</p>
                </div>
              </Stack>
            </Stack>
          </Drawer>

          {/* CONFIRMATION DIALOG COMPONENT */}
          <ConfirmationDialog
            isOpen={isConfirmOpen}
            onClose={() => setIsConfirmOpen(false)}
            onConfirm={() => {
              toast.success('Practitioner record deleted.');
              setIsConfirmOpen(false);
            }}
            title="Revoke Practitioner Privilege"
            description="Are you absolutely sure you want to revoke privileges for Dr. Bruce Banner? This practitioner will immediately lose EHR database access."
            confirmText="Revoke Privileges"
            type="danger"
          />
        </TabsContent>

        {/* TABLES & LOADERS */}
        <TabsContent value="tables" className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Responsive Sortable Table</h2>
            <ResponsiveTable
              columns={[
                { header: 'Practitioner', accessor: 'name', sortable: true },
                { header: 'Clinical Specialty', accessor: 'specialty', sortable: true },
                {
                  header: 'Load Status',
                  accessor: 'status',
                  render: (row) => {
                    const map = { Active: 'success', Away: 'warning', Offline: 'neutral' };
                    return <StatusChip status={map[row.status] || 'neutral'} label={row.status} />;
                  }
                },
                {
                  header: 'Shift Allocation',
                  accessor: 'load',
                  render: (row) => <Progress value={row.load} className="max-w-[120px]" />
                }
              ]}
              data={tableData}
              sortConfig={sortConfig}
              onSort={handleSort}
              onRowClick={(row) => toast.info(`Row clicked: ${row.name}`)}
            />
            
            <Spacer size={2} />
            <Pagination currentPage={currentPage} totalPages={8} onPageChange={setCurrentPage} />
          </section>

          <Divider />

          <section className="space-y-6">
            <h2 className="text-lg font-bold text-text-primary">Skeleton Loading States</h2>
            
            <div>
              <span className="text-xs text-text-muted mb-2 block">Spinner Components</span>
              <Stack direction="row" spacing={6} align="center">
                <Spinner size="sm" />
                <Spinner size="md" variant="secondary" />
                <Spinner size="lg" variant="primary" />
              </Stack>
            </div>

            <Divider />

            <div>
              <span className="text-xs text-text-muted mb-3 block">Skeleton Card</span>
              <SkeletonCard className="max-w-md" />
            </div>

            <Divider />

            <div>
              <span className="text-xs text-text-muted mb-3 block">Skeleton Profile Layout</span>
              <SkeletonProfile className="max-w-sm" />
            </div>

            <Divider />

            <div>
              <span className="text-xs text-text-muted mb-3 block">Skeleton Dashboard Grid Layout</span>
              <SkeletonDashboard />
            </div>
          </section>
        </TabsContent>

        {/* LAYOUT PANEL */}
        <TabsContent value="layout" className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Spacing & Layout Primitives</h2>
            
            <div className="space-y-3">
              <span className="text-xs text-text-muted">Vertical Stack Primitive (gap-3 spacing)</span>
              <div className="p-4 border border-border-light rounded-xl bg-gray-50/50 dark:bg-gray-800/10">
                <Stack spacing={3}>
                  <div className="p-2.5 bg-bg-card border border-border-light rounded-lg text-xs font-semibold text-text-primary">Watson Block A</div>
                  <div className="p-2.5 bg-bg-card border border-border-light rounded-lg text-xs font-semibold text-text-primary">Watson Block B</div>
                  <div className="p-2.5 bg-bg-card border border-border-light rounded-lg text-xs font-semibold text-text-primary">Watson Block C</div>
                </Stack>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs text-text-muted">Horizontal Stack Primitive (gap-6 spacing)</span>
              <div className="p-4 border border-border-light rounded-xl bg-gray-50/50 dark:bg-gray-800/10">
                <Stack direction="row" justify="between" spacing={6} align="center">
                  <div className="p-2.5 bg-bg-card border border-border-light rounded-lg text-xs font-semibold text-text-primary">Watson Left</div>
                  <div className="p-2.5 bg-bg-card border border-border-light rounded-lg text-xs font-semibold text-text-primary">Watson Center</div>
                  <div className="p-2.5 bg-bg-card border border-border-light rounded-lg text-xs font-semibold text-text-primary">Watson Right</div>
                </Stack>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-xs text-text-muted">Grid Primitive (cols-3 gap-4)</span>
              <Grid cols={1} colsSm={3} gap={4}>
                <div className="p-4 bg-bg-card border border-border-light rounded-xl text-center text-xs font-semibold text-text-primary">Grid Column 1</div>
                <div className="p-4 bg-bg-card border border-border-light rounded-xl text-center text-xs font-semibold text-text-primary">Grid Column 2</div>
                <div className="p-4 bg-bg-card border border-border-light rounded-xl text-center text-xs font-semibold text-text-primary">Grid Column 3</div>
              </Grid>
            </div>
          </section>

          <Divider />

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">Centralized Icon Vault</h2>
            <p className="text-xs text-text-muted max-w-xl">
              Centralized lucide wrapper exports to avoid duplicate inline icon imports and establish standard icon parameters.
            </p>
            <Card>
              <CardContent className="p-6">
                <Grid cols={3} colsSm={6} gap={6}>
                  <Stack align="center" spacing={2} className="p-3 border border-border-light rounded-lg">
                    <Icons.IconActivity size={24} className="text-primary-600" />
                    <span className="text-[10px] text-text-muted text-center leading-none">IconActivity</span>
                  </Stack>
                  <Stack align="center" spacing={2} className="p-3 border border-border-light rounded-lg">
                    <Icons.IconCheck size={24} className="text-success-600" />
                    <span className="text-[10px] text-text-muted text-center leading-none">IconCheck</span>
                  </Stack>
                  <Stack align="center" spacing={2} className="p-3 border border-border-light rounded-lg">
                    <Icons.IconAlertCircle size={24} className="text-warning-500" />
                    <span className="text-[10px] text-text-muted text-center leading-none">IconAlertCircle</span>
                  </Stack>
                  <Stack align="center" spacing={2} className="p-3 border border-border-light rounded-lg">
                    <Icons.IconAlertTriangle size={24} className="text-danger-600" />
                    <span className="text-[10px] text-text-muted text-center leading-none">IconAlertTriangle</span>
                  </Stack>
                  <Stack align="center" spacing={2} className="p-3 border border-border-light rounded-lg">
                    <Icons.IconSparkles size={24} className="text-secondary-500" />
                    <span className="text-[10px] text-text-muted text-center leading-none">IconSparkles</span>
                  </Stack>
                  <Stack align="center" spacing={2} className="p-3 border border-border-light rounded-lg">
                    <Icons.IconHeartPulse size={24} className="text-danger-600" />
                    <span className="text-[10px] text-text-muted text-center leading-none">IconHeartPulse</span>
                  </Stack>
                </Grid>
              </CardContent>
            </Card>
          </section>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default DesignSystem;
