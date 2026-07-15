CREATE POLICY "Guru bisa update soal" ON assessment_soal FOR UPDATE USING (auth.uid() = guru_id); CREATE POLICY "Guru bisa hapus soal" ON assessment_soal FOR DELETE USING (auth.uid() = guru_id);
