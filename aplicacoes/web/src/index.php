<?php
$apiUrl = getenv('API_URL') ?: 'http://localhost:8000';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>LinkMark - Gerenciador de Links</title>
    
    <!-- CSS Modularizado -->
    <link rel="stylesheet" href="/assets/css/main.css?v=<?php echo time(); ?>"/>
    <link rel="stylesheet" href="/assets/css/components.css?v=<?php echo time(); ?>"/>
    <link rel="stylesheet" href="/assets/css/auth.css?v=<?php echo time(); ?>"/>
    <link rel="stylesheet" href="/assets/css/dashboard.css?v=<?php echo time(); ?>"/>
</head>
<body>
    <?php include 'components/header.php'; ?>

    <div class="app-wrapper">
        <?php include 'pages/auth.php'; ?>
        <?php include 'pages/dashboard.php'; ?>
    </div>

    <?php include 'components/footer.php'; ?>

    <!-- JavaScript Modularizado -->
    <script>
        window.__CONFIG__ = {API_URL: <?php echo json_encode($apiUrl); ?> };
    </script>
    <script src="/assets/js/utils.js?v=<?php echo time(); ?>"></script>
    <script src="/assets/js/auth.js?v=<?php echo time(); ?>"></script>
    <script src="/assets/js/categories.js?v=<?php echo time(); ?>"></script>
    <script src="/assets/js/links.js?v=<?php echo time(); ?>"></script>
    <script src="/assets/js/app.js?v=<?php echo time(); ?>"></script>
</body>
</html>