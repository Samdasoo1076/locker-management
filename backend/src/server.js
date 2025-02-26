const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 모든 사물함 조회
app.get('/api/lockers', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.*, 
             u.id as user_id, 
             u.name as user_name, 
             u.student_id,
             u.start_date,
             u.end_date
      FROM lockers l
      LEFT JOIN users u ON l.id = u.locker_id
    `);
    
    const lockers = rows.map(row => ({
      id: row.id,
      number: row.number,
      position: {
        row: row.row_pos,
        col: row.col_pos
      },
      status: row.status,
      user: row.user_id ? {
        id: row.user_id,
        name: row.user_name,
        studentId: row.student_id,
        startDate: row.start_date,
        endDate: row.end_date
      } : undefined
    }));

    res.json(lockers);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 사물함 초기화
app.post('/api/lockers/initialize', async (req, res) => {
  try {
    const { rows, cols } = req.body;

    await pool.query('DELETE FROM users');
    await pool.query('DELETE FROM lockers');

    const values = [];
    let number = 1;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        values.push([uuidv4(), number++, row, col, 'available']);
      }
    }

    await pool.query(
      'INSERT INTO lockers (id, number, row_pos, col_pos, status) VALUES ?',
      [values]
    );

    res.json({ message: '사물함이 초기화되었습니다.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 등록
app.post('/api/lockers/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, studentId, startDate, endDate } = req.body;

    // 날짜를 MySQL DATETIME 형식으로 변환
    const formattedStartDate = new Date(startDate).toISOString().slice(0, 19).replace('T', ' ');
    const formattedEndDate = new Date(endDate).toISOString().slice(0, 19).replace('T', ' ');

    const userId = uuidv4();
    await pool.query(
      'INSERT INTO users (id, locker_id, name, student_id, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, id, name, studentId, formattedStartDate, formattedEndDate]
    );

    await pool.query(
      'UPDATE lockers SET status = ? WHERE id = ?',
      ['occupied', id]
    );

    res.json({ message: '사용자가 등록되었습니다.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 사용자 해제
app.delete('/api/lockers/:id/user', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM users WHERE locker_id = ?', [id]);
    await pool.query(
      'UPDATE lockers SET status = ? WHERE id = ?',
      ['available', id]
    );

    res.json({ message: '사용자가 해제되었습니다.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 