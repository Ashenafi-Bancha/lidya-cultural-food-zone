import { useQuery } from '@tanstack/react-query';
import { testimonialService } from '../services/testimonial.service';

export const useTestimonials = () => {
  return useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialService.getAll,
  });
};
