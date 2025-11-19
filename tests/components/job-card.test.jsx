import { render, screen } from '@testing-library/react'
import { JobCard } from '@/components/job-card'

describe('JobCard', () => {
  const mockJob = {
    id: '123',
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$80k - $120k',
    postedDate: '2 days ago',
    description: 'Great opportunity to work with cutting-edge technology',
    tags: ['React', 'TypeScript', 'Node.js']
  }

  test('renders job title', () => {
    render(<JobCard {...mockJob} />)
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
  })

  test('renders company name', () => {
    render(<JobCard {...mockJob} />)
    expect(screen.getByText('Tech Corp')).toBeInTheDocument()
  })

  test('renders job description', () => {
    render(<JobCard {...mockJob} />)
    expect(screen.getByText('Great opportunity to work with cutting-edge technology')).toBeInTheDocument()
  })

  test('renders posted date', () => {
    render(<JobCard {...mockJob} />)
    expect(screen.getByText('2 days ago')).toBeInTheDocument()
  })

  test('renders all tags', () => {
    render(<JobCard {...mockJob} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Node.js')).toBeInTheDocument()
  })

  test('does not render tags section when tags array is empty', () => {
    const jobWithoutTags = { ...mockJob, tags: [] }
    render(<JobCard {...jobWithoutTags} />)
    expect(screen.queryByText('React')).not.toBeInTheDocument()
  })

  test('has link to job details page', () => {
    render(<JobCard {...mockJob} />)
    const link = screen.getByRole('link', { name: /view details/i })
    expect(link).toHaveAttribute('href', '/jobs/123')
  })

  test('renders with minimal required props', () => {
    const minimalJob = {
      id: '456',
      title: 'Developer',
      company: 'Startup Inc',
      description: 'Join our team'
    }
    render(<JobCard {...minimalJob} />)
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('Startup Inc')).toBeInTheDocument()
  })
})
