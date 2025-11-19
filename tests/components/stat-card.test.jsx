import { render, screen } from '@testing-library/react'
import { StatCard } from '@/components/stat-card'
import { Users } from 'lucide-react'

describe('StatCard', () => {
  test('renders title and value', () => {
    render(<StatCard title="Total Jobs" value={42} />)
    expect(screen.getByText('Total Jobs')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  test('renders description when provided', () => {
    render(<StatCard title="Jobs" value={10} description="Active listings" />)
    expect(screen.getByText('Active listings')).toBeInTheDocument()
  })

  test('renders icon when provided', () => {
    const { container } = render(<StatCard title="Users" value={100} icon={Users} />)
    // Check if icon is rendered (lucide icons render as SVG)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  test('renders positive trend correctly', () => {
    render(<StatCard
      title="Applications"
      value={50}
      trend={{ isPositive: true, value: 12 }}
    />)
    const trend = screen.getByText('+12%')
    expect(trend).toBeInTheDocument()
    expect(trend).toHaveClass('text-success')
  })

  test('renders negative trend correctly', () => {
    render(<StatCard
      title="Applications"
      value={30}
      trend={{ isPositive: false, value: 5 }}
    />)
    const trend = screen.getByText('5%')
    expect(trend).toBeInTheDocument()
    expect(trend).toHaveClass('text-destructive')
  })

  test('does not render description when not provided', () => {
    render(<StatCard title="Jobs" value={20} />)
    const descriptions = screen.queryAllByText(/./i).filter(el =>
      el.textContent !== 'Jobs' && el.textContent !== '20'
    )
    // Should only have title and value, no description
    expect(descriptions.filter(el => el.classList.contains('text-xs'))).toHaveLength(0)
  })

  test('does not render trend when not provided', () => {
    render(<StatCard title="Jobs" value={20} />)
    expect(screen.queryByText(/%/)).not.toBeInTheDocument()
  })

  test('renders string values', () => {
    render(<StatCard title="Status" value="Active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })
})
