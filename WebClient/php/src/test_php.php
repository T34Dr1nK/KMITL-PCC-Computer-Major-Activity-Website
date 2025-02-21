<?php
// ตั้งค่าการเชื่อมต่อฐานข้อมูล
$host = 'localhost'; // หรือ IP ของเซิร์ฟเวอร์
$port = 8080;        // กำหนดพอร์ตที่ต้องการ

$dbname = 'activity_management';
$username = 'root';
$password = 'password'; // แก้ไขตามรหัสผ่าน MySQL ของคุณ

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Connection failed: " . $e->getMessage());
}

// ดึงข้อมูลกิจกรรมจากฐานข้อมูล
$query = "SELECT * FROM activities ORDER BY activity_date ASC";
$stmt = $pdo->prepare($query);
$stmt->execute();
$activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Branch Activities</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            color: #333;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid #ddd;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
        th {
            background-color: #f4f4f4;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <h1>Branch Activities</h1>
    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Branch Name</th>
                <th>Activity Name</th>
                <th>Activity Date</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($activities) > 0): ?>
                <?php foreach ($activities as $activity): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($activity['id']); ?></td>
                        <td><?php echo htmlspecialchars($activity['branch_name']); ?></td>
                        <td><?php echo htmlspecialchars($activity['activity_name']); ?></td>
                        <td><?php echo htmlspecialchars($activity['activity_date']); ?></td>
                        <td><?php echo htmlspecialchars($activity['description']); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="5">No activities found.</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>
</body>
</html>