from neo4j import GraphDatabase
import numpy as np
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
import seaborn as sns


# Define the UserNode class to represent the node
class UserNode:
    def __init__(self, node_id, username, food, nature, photography, cars):
        self.node_id = node_id
        self.username = username
        self.food = food
        self.nature = nature
        self.photography = photography
        self.cars = cars

    def get_features(self):
        """Return features for clustering"""
        return [self.food, self.nature, self.photography, self.cars]


# Neo4j connection details
uri = "bolt://localhost:7687"  # Replace with your Neo4j URI
username = "neo4j"  # Replace with your Neo4j username
password = "12345678"  # Replace with your Neo4j password

# Create the Neo4j driver
driver = GraphDatabase.driver(uri, auth=(username, password))


# Function to fetch the required attributes from Neo4j
def fetch_user_data():
    query = """
    MATCH (u:User) 
    RETURN u.id AS id, u.name AS name, u.food AS food, u.nature AS nature, u.photography AS photography, u.cars AS cars
    """
    with driver.session() as session:
        result = session.run(query)
        users = []
        for record in result:
            # Create UserNode object for each record
            user = UserNode(
                node_id=record["id"],
                username=record["name"],
                food=record["food"],
                nature=record["nature"],
                photography=record["photography"],
                cars=record["cars"],
            )
            users.append(user)
    return users


# Function to update the nodes in Neo4j with the cluster_id
def update_user_clusters(user_nodes, cluster_labels):
    with driver.session() as session:
        for i, user in enumerate(user_nodes):
            cluster_id = cluster_labels[i]
            query = """
            MATCH (u:User {name: $username})
            SET u.cluster2Id = $cluster_id
            """
            session.run(query, username=user.username, cluster_id=cluster_id)


# Fetch data from Neo4j and store it in UserNode objects
user_nodes = fetch_user_data()

# Extract feature data for clustering
X = np.array([user.get_features() for user in user_nodes])

# Perform KMeans clustering (for example, 3 clusters)
kmeans = KMeans(n_clusters=2, random_state=0)
kmeans.fit(X)

# Update the nodes in Neo4j with the assigned cluster_id
update_user_clusters(user_nodes, kmeans.labels_)

# Dimensionality Reduction using PCA (from 4D to 2D for visualization)
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X)

# Plotting the clusters with PCA-reduced data
plt.figure(figsize=(8, 6))
sns.scatterplot(
    x=X_pca[:, 0], y=X_pca[:, 1], hue=kmeans.labels_, palette="viridis", s=100
)
plt.title("KMeans Clustering (PCA Reduced Features)")
plt.xlabel("Principal Component 1")
plt.ylabel("Principal Component 2")
plt.legend(title="Cluster")
plt.show()

# Close the Neo4j driver connection
driver.close()
