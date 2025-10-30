import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { levelService } from '../../services/levelService.js';

const LevelExercisesRedirect = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const go = async () => {
      try {
        const res = await levelService.getLevelById(levelId);
        const level = res?.data;
        const planetId = level?.planetId || level?.planet_id;
        if (planetId) {
          navigate(`/student/planets/${planetId}/levels`, { replace: true });
        } else {
          navigate('/student', { replace: true });
        }
      } catch (e) {
        navigate('/student', { replace: true });
      } finally {
        setLoading(false);
      }
    };
    go();
  }, [levelId, navigate]);

  if (loading) return null;
  return null;
};

export default LevelExercisesRedirect;


