export interface Job {
    code: number;
    title: string;
    description: string | null;
    created_at: string | null;
    company: string;
    company_domain: string;
    company_logo: string;
    limit_date: string;
    recruiter_name: string;
    recruiter_works_here: boolean;
}