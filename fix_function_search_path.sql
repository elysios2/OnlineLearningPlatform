-- Script para corregir la vulnerabilidad de search_path mutable en la función enroll_user_in_course

-- Primero, eliminamos la función existente (si existe)
DROP FUNCTION IF EXISTS public.enroll_user_in_course;

-- Recreamos la función con search_path establecido como parámetro
CREATE OR REPLACE FUNCTION public.enroll_user_in_course(
  user_id bigint,
  course_id bigint,
  progress numeric DEFAULT 0
)
RETURNS SETOF user_courses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  enrollment_record user_courses;
BEGIN
  -- Verificar si ya existe una inscripción
  SELECT * INTO enrollment_record
  FROM user_courses
  WHERE user_courses.user_id = $1
  AND user_courses.course_id = $2;
  
  -- Si ya está inscrito, actualizar el progreso si es necesario
  IF FOUND THEN
    IF enrollment_record.progress < progress THEN
      UPDATE user_courses
      SET progress = $3
      WHERE user_id = $1 AND course_id = $2
      RETURNING * INTO enrollment_record;
    END IF;
  ELSE
    -- Si no está inscrito, crear un nuevo registro
    INSERT INTO user_courses (user_id, course_id, progress, enrolled_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING * INTO enrollment_record;
  END IF;
  
  RETURN NEXT enrollment_record;
END;
$$;

-- Añadir comentario a la función
COMMENT ON FUNCTION public.enroll_user_in_course IS 'Inscribe a un usuario en un curso o actualiza su progreso si ya está inscrito. Seguridad mejorada con search_path fijo.';

-- Establecer los permisos adecuados
REVOKE ALL ON FUNCTION public.enroll_user_in_course FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.enroll_user_in_course TO authenticated;
GRANT EXECUTE ON FUNCTION public.enroll_user_in_course TO service_role;